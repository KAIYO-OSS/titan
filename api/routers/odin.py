from fastapi import APIRouter
from util.utilityHelpers import Utils
from models.deployRequest import DeployRequest
from models.workspaceRequest import WorkspaceRequest
from models.updateRequest import UpdateRequest
from service.plugins.azure.azure_aks_deploy import OdinUserServiceDeployment, OdinUserServiceDelete, OdinUserWorkspaceDeployment,OdinUserServiceUpgrade, OdinUserWorkspaceDelete, OdinWorkspaceHealth
import util.mongoUtil as mu
router = APIRouter()


@router.post("/odin/deploy/workspace/", tags=["odin"])
async def deploy_workspace(workspaceRequest: WorkspaceRequest):
    try:
        Utils.isValidProvider(workspaceRequest.provider)
        deploy = OdinUserWorkspaceDeployment(workspaceRequest)
        if str.lower(workspaceRequest.provider) == "azure":
            deploy.deployAzureWorkspace()
            return {
                "status": "200",
                "metadata": {},
                "error": ""
            }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Workspace deployment failed: " + str(ex)
        }

@router.delete("/odin/remove/workspace/{workspaceId}", tags=["odin"])
async def delete_workspace(workspaceId: str):
    try:
        workspace = mu.find_by_id("workspace", workspaceId)
        clusterName = workspace["clusterName"]
        rgName = workspace["resourceGroupName"]
        odinServiceDelte = OdinUserWorkspaceDelete(workspaceId, rgName, clusterName)
        odinServiceDelte.deleteAzureWorkspace()
        return {
            "status": "200",
            "metadata": {},
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Workspace delete failed: " + str(ex)
        }

@router.post("/odin/deploy/service/", tags=["odin"])
async def deploy_service(deploy_request: DeployRequest):
    try:
        workspace = mu.find_by_id("workspace", deploy_request.workspaceID)
        rg = workspace["resourceGroupName"]
        cluster = workspace["clusterName"]
        deploy = OdinUserServiceDeployment(deploy_request.releaseName, deploy_request.env,
                                        Utils.getService(deploy_request.serviceId), deploy_request.values, rg,
                                        cluster,deploy_request.userId,deploy_request.workspaceID,deploy_request.serviceId)
        url, ip = deploy.deployAzureUserService()
        return {
            "status": "200",
            "metadata": {
                "url": url,
                "ip": ip
            },
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Service deployment failed: " + str(ex)
        }


@router.post("/odin/update/service/", tags=["odin"])
async def update_deploy_service(update_request: UpdateRequest):
    try:
        service = mu.find_by_id("service", update_request.deploymentId)
        workspace = mu.find_by_id("workspace", service["workspaceId"])
        rgName = workspace["resourceGroupName"]
        clusterName = workspace["clusterName"]
        serviceName = service["serviceName"]
        odinServiceDelete = OdinUserServiceUpgrade(rgName, clusterName, serviceName, service["_id"] , Utils.getService(service["serviceId"]), update_request.values)
        odinServiceDelete.updateAzureUserService()
        return {
            "status": "200",
            "metadata": {},
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Service update failed: " + str(ex)
        }


@router.delete("/odin/remove/service/{deploymentId}", tags=["odin"])
async def delete_deployment(deploymentId: str):
    try:
        service = mu.find_by_id("service", deploymentId)
        workspace = mu.find_by_id("workspace", service["workspaceId"])
        rgName = workspace["resourceGroupName"]
        clusterName = workspace["clusterName"]
        serviceName = service["serviceName"]
        odinServiceDelte = OdinUserServiceDelete(rgName, clusterName, serviceName, deploymentId)
        odinServiceDelte.deleteAzureUserService()
        return {
            "status": "200",
            "metadata": {},
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Service delete failed: " + str(ex)
        }


@router.get("/odin/monitor/workspace/{workspaceId}", tags=["odin"])
async def get_health(workspaceId):
    workspace = mu.find_by_id("workspace", workspaceId)
    rgName = workspace["resourceGroupName"]
    clusterName = workspace["clusterName"]
    odinWorkspaceHealth = OdinWorkspaceHealth(rgName, clusterName)
    return odinWorkspaceHealth.getAzureWorkspaceHealth()

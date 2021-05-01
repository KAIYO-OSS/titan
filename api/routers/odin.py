from fastapi import APIRouter
from util.helm import Helm
from models.deployRequest import DeployRequest

router = APIRouter()


@router.post("/odin/deploy/service/", tags=["odin"])
async def deploy_service(deploy_request: DeployRequest):
    try:
        # workspace = mu.find_by_id("workspace", deploy_request.workspaceID)
        # rg = workspace["resourceGroupName"]
        # cluster = workspace["clusterName"]
        # deploy = OdinUserServiceDeployment(deploy_request.releaseName, deploy_request.env,
        #                                    Utils.getService(deploy_request.serviceId), deploy_request.values, rg,
        #                                    cluster, deploy_request.userId, deploy_request.workspaceID,
        #                                    deploy_request.serviceId)
        # url, ip = deploy.deployAzureUserService()
        Helm.odinHelmSetup()
        output = Helm.deployService(deploy_request.service_name, deploy_request.chart_name, deploy_request.values)
        return {
            "status": "200",
            "metadata": output,
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Service deployment failed: " + str(ex)
        }


# @router.post("/odin/update/service/", tags=["odin"])
# async def update_deploy_service(update_request: UpdateRequest):
#     try:
#         service = mu.find_by_id("service", update_request.deploymentId)
#         workspace = mu.find_by_id("workspace", service["workspaceId"])
#         rgName = workspace["resourceGroupName"]
#         clusterName = workspace["clusterName"]
#         serviceName = service["serviceName"]
#         odinServiceDelete = OdinUserServiceUpgrade(rgName, clusterName, serviceName, service["_id"],
#                                                    Utils.getService(service["serviceId"]), update_request.values)
#         odinServiceDelete.updateAzureUserService()
#         return {
#             "status": "200",
#             "metadata": {},
#             "error": ""
#         }
#     except Exception as ex:
#         return {
#             "status": "500",
#             "metadata": {},
#             "error": "Service update failed: " + str(ex)
#         }


# @router.delete("/odin/remove/service/{deploymentId}", tags=["odin"])
# async def delete_deployment(deploymentId: str):
#     try:
#         service = mu.find_by_id("service", deploymentId)
#         workspace = mu.find_by_id("workspace", service["workspaceId"])
#         rgName = workspace["resourceGroupName"]
#         clusterName = workspace["clusterName"]
#         serviceName = service["serviceName"]
#         odinServiceDelte = OdinUserServiceDelete(rgName, clusterName, serviceName, deploymentId)
#         odinServiceDelte.deleteAzureUserService()
#         return {
#             "status": "200",
#             "metadata": {},
#             "error": ""
#         }
#     except Exception as ex:
#         return {
#             "status": "500",
#             "metadata": {},
#             "error": "Service delete failed: " + str(ex)
#         }


@router.get("/odin/monitor/service/{service_name}", tags=["odin"])
async def get_status(service_name):
    try:
        status = Helm.getServiceStatus(service_name)
        return {
            "status": "200",
            "metadata": status,
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Failed to fetch Service Status: " + str(ex)
        }


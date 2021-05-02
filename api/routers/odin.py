from fastapi import APIRouter
from util.helm import Helm
from models.deployRequest import DeployRequest

router = APIRouter()


@router.post("/odin/service/deploy", tags=["odin"])
async def deploy_service(deploy_request: DeployRequest):
    try:
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


@router.delete("/odin/service/delete/{service_name}", tags=["odin"])
async def delete_service(service_name):
    try:
        Helm.deleteService(service_name)
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


@router.get("/odin/services/", tags=["odin"])
async def get_all_services():
    try:
        service_list = Helm.listAllServices()
        return {
            "status": "200",
            "metadata": service_list,
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Failed to fetch all services: " + str(ex)
        }


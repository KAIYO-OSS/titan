from fastapi import APIRouter
from util.utilityHelpers import Utils
from models.deployRequest import DeployRequest
from models.workspaceRequest import WorkspaceRequest
from models.updateRequest import UpdateRequest
import util.mongoUtil as mu
import util.serviceBusUtil as ServiceBusUtil
import uuid
router = APIRouter()

@router.post("/odinsb/deploy/workspace/", tags=["odinsb"])
async def deploytest_workspace(workspaceRequest: WorkspaceRequest):
    try:
        Utils.isValidProvider(workspaceRequest.provider)
        messageId = str(uuid.uuid4())
        ServiceBusUtil.sendQueueMessage("api-deployWorkspace", workspaceRequest.toJSON(),messageId)
        return {
            "status": "200",
            "metadata": {
                "pollingURL":"/polling/deploy/workspace/{id}".format(id=messageId)
            },
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Workspace deployment failed: " + str(ex)
        }

@router.delete("/odinsb/remove/workspace/{workspaceId}", tags=["odinsb"])
async def delete_workspace(workspaceId: str):
    try:
        workspace = mu.find_by_id("workspace", workspaceId)
        messageId = workspaceId
        ServiceBusUtil.sendQueueMessage("api-deleteWorkspace", Utils.serializeJson(workspace), messageId)
        return {
            "status": "200",
            "metadata": {
                "pollingURL":"/polling/remove/workspace/{id}".format(id=messageId)
            },
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Workspace delete failed: " + str(ex)
        }

@router.post("/odinsb/deploy/service/", tags=["odinsb"])
async def deploy_service(deployRequest: DeployRequest):
    try:
        messageId = str(uuid.uuid4())
        ServiceBusUtil.sendQueueMessage("api-deployService", deployRequest.toJSON(), messageId)
        return {
            "status": "200",
            "metadata": {
                "pollingURL":"/polling/deploy/service/{deploymentId}".format(deploymentId=messageId)
            },
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Service deployment failed: " + str(ex)
        }

@router.post("/odinsb/update/service/", tags=["odinsb"])
async def update_deploy_service(updateRequest: UpdateRequest):
    try:
        messageId = str(updateRequest.deploymentId)
        ServiceBusUtil.sendQueueMessage("api-updateService", updateRequest.toJSON(), messageId)
        return {
            "status": "200",
            "metadata": {
                "pollingURL":"/polling/update/service/{deploymentId}".format(deploymentId=updateRequest.deploymentId)
            },
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Service update failed: " + str(ex)
        }

@router.delete("/odinsb/remove/service/{deploymentId}", tags=["odinsb"])
async def delete_deployment(deploymentId: str):
    try:
        messageId = deploymentId
        service = mu.find_by_id("service", deploymentId)
        ServiceBusUtil.sendQueueMessage("api-deleteService", Utils.serializeJson(service), messageId)
        return {
            "status": "200",
            "metadata": {
                "pollingURL":"/polling/delete/service/{deploymentId}".format(deploymentId=deploymentId)
            },
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Service delete failed: " + str(ex)
        }

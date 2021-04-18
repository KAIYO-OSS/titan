from util.azure import Azure
import util.mongoUtil as mu
from util.utilityHelpers import Utils
from models.enums.workflows import DeleteWorkspace
from azure.servicebus import Message
import util.serviceBusUtil as ServiceBusUtil
import time
import logging

logger = logging.getLogger("ODIN")


class WorkspaceDelete:

    # success-deleteWorkspace
    @staticmethod
    def startSuccessWorkflow(message: Message):
        logger.info(".....success workflow path.....")
        workspaceId = (message.properties.message_id).decode('utf-8')
        workspaceDB = mu.find_by_id("workspace", workspaceId)
        rg = workspaceDB["resourceGroupName"]
        cluster = workspaceDB["clusterName"]

        if (workspaceDB["status"] == str(DeleteWorkspace.Deleted.name)):
            message.complete()

        try:
            if (workspaceDB["status"] == str(DeleteWorkspace.DeleteWorkspaceAccepted.name)):
                mu.updateStatus("workspace", workspaceId, str(DeleteWorkspace.DeletingCluster.name))
                # Azure
                Azure.deleteAKSCluster(rg, cluster)
                mu.updateStatus("workspace", workspaceId, str(DeleteWorkspace.DeletedCluster.name))
        except Exception as ex:
            mu.updateStatus("workspace", workspaceId, str(DeleteWorkspace.ClusterDeleteFailed.name), str(ex), True)
            logger.exception(ex)
            message.complete()

        workspaceDB = mu.find_by_id("workspace", workspaceId)

        try:
            if (workspaceDB["status"] == str(DeleteWorkspace.DeletedCluster.name)):
                mu.updateStatus("workspace", workspaceId, str(DeleteWorkspace.DeletingRG.name))
                # Azure
                Azure.deleteResourceGroup(rg)
                mu.updateStatus("workspace", workspaceId, str(DeleteWorkspace.Deleted.name))
                message.complete()
        except Exception as ex:
            mu.updateStatus("workspace", workspaceId, str(DeleteWorkspace.RGDeleteFailed.name), str(ex), True)
            logger.exception(ex)
            message.complete()

    # api-deleteWorkspace
    @staticmethod
    def startWorkflow(message: Message):
        try:
            logger.info(".....start workflow path.....")
            ServiceBusUtil.azureLogin()
            messageString = str(message.message)
            workspaceId = (message.properties.message_id).decode('utf-8')
            mu.updateStatus("workspace", workspaceId, str(DeleteWorkspace.DeleteWorkspaceAccepted.name))
            message.complete()
            ServiceBusUtil.sendQueueMessage("success-deleteWorkspace", messageString, workspaceId, "str",
                                            str(DeleteWorkspace.DeletingCluster.name))
        except Exception as ex:
            mu.save("FailedWorkflows", str(message.message))
            logger.exception(ex)

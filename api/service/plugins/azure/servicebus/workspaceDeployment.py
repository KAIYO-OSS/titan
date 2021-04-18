# from util.azure import Azure
# import util.mongoUtil as mu
# from util.utilityHelpers import Utils
# from models.db.workspace import WorkspaceModel
# from models.enums.workflows import DeployWorkspace
# from azure.servicebus import Message
# import util.serviceBusUtil as ServiceBusUtil
# import time
# import logging

# logger = logging.getLogger("ODIN")


# class WorkspaceDeployment:

#     # success-deployWorkspace
#     @staticmethod
#     def startSuccessWorkflow(message: Message):
#         logger.info(".....success workflow path.....")
#         messageString = str(message.message)
#         data = Utils.getJson(messageString)
#         rg = data["resourceGroup"]
#         rgLocation = data["resourceGroupLocation"]
#         cluster = data["clusterName"]
#         nodeCount = data["nodeCount"]
#         clusterType = data["clusterType"]
#         vmSize = Utils.getVMSize(clusterType)
#         workspaceId = (message.properties.message_id).decode('utf-8')
#         workspaceDB = mu.find_by_id("workspace", workspaceId)
#         if (workspaceDB["status"] == str(DeployWorkspace.Completed.name)):
#             message.complete()

#         try:
#             if (workspaceDB["status"] == str(DeployWorkspace.DeployWorkspaceAccepted.name)):
#                 mu.updateStatus("workspace", workspaceId, str(DeployWorkspace.CreatingRG.name))
#                 # Azure
#                 Azure.createResourceGroup(rg, rgLocation)
#                 mu.updateStatus("workspace", workspaceId, str(DeployWorkspace.CreatedRG.name))
#         except Exception as ex:
#             mu.updateStatus("workspace", workspaceId, str(DeployWorkspace.CreatingRGFailed.name), str(ex), True)
#             logger.exception(ex)
#             message.complete()

#         workspaceDB = mu.find_by_id("workspace", workspaceId)

#         try:
#             if (workspaceDB["status"] == str(DeployWorkspace.CreatedRG.name)):
#                 mu.updateStatus("workspace", workspaceId, str(DeployWorkspace.CreatingCluster.name))
#                 # Azure
#                 Azure.createAKSCluster(rg, cluster, nodeCount, vmSize)
#                 mu.updateStatus("workspace", workspaceId, str(DeployWorkspace.Completed.name))
#                 message.complete()
#         except Exception as ex:
#             mu.updateStatus("workspace", workspaceId, str(DeployWorkspace.CreatingClusterFailed.name), str(ex), True)
#             logger.exception(ex)
#             message.complete()

#     # api-deployWorkspace 
#     @staticmethod
#     def startWorkflow(message: Message):
#         try:
#             logger.info(".....start workflow path.....")
#             ServiceBusUtil.azureLogin()
#             messageString = str(message.message)
#             data = Utils.getJson(messageString)
#             workspaceId = (message.properties.message_id).decode('utf-8')
#             rg = data["resourceGroup"]
#             rgLocation = data["resourceGroupLocation"]
#             cluster = data["clusterName"]
#             nodeCount = data["nodeCount"]
#             clusterType = data["clusterType"]
#             vmSize = Utils.getVMSize(clusterType)
#             workspaceModel: WorkspaceModel = {
#                 "_id": workspaceId,
#                 "userId": data["userId"],
#                 "provider": data["provider"],
#                 "resourceGroupName": rg,
#                 "clusterName": cluster,
#                 "nodeCount": nodeCount,
#                 "clusterType": clusterType,
#                 "rgLocation": rgLocation,
#                 "vmSize": vmSize,
#                 "status": str(DeployWorkspace.DeployWorkspaceAccepted.name),
#                 "createdAt": int(time.time()),
#                 "updatedAt": int(time.time()),
#                 "exception": "",
#                 "toBeDeleted": False
#             }
#             mu.save("workspace", workspaceModel)
#             message.complete()
#             ServiceBusUtil.sendQueueMessage("success-deployWorkspace", messageString, workspaceId, "str",
#                                             str(DeployWorkspace.CreatingRG.name))
#         except Exception as ex:
#             mu.save("FailedWorkflows", str(message.message))
#             logger.exception(ex)
#             message.complete()

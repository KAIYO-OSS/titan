# from util.azure import Azure
# import util.mongoUtil as mu
# from util.utilityHelpers import Utils
# from models.db.service import ServiceModel
# from models.enums.workflows import UpdateService
# from azure.servicebus import Message
# import util.serviceBusUtil as ServiceBusUtil
# from util.helm import Helm
# import time
# import logging

# logger = logging.getLogger("ODIN")


# class ServiceUpdate:

#     # success-updateService
#     @staticmethod
#     def startSuccessWorkflow(message: Message):
#         logger.info(".....success workflow path.....")
#         messageString = str(message.message)
#         data = Utils.getJson(messageString)
#         deploymentId = (message.properties.message_id).decode('utf-8')
#         serviceDB = mu.find_by_id("service", deploymentId)
#         workspaceDB = mu.find_by_id("workspace", serviceDB["workspaceId"])
#         rg = workspaceDB["resourceGroupName"]
#         cluster = workspaceDB["clusterName"]
#         if (serviceDB["status"] == str(UpdateService.Completed.name)):
#             message.complete()

#         try:
#             if (serviceDB["status"] == str(UpdateService.UpdateServiceAccepted.name)):
#                 mu.updateStatus("service", deploymentId, str(UpdateService.ConnectingToCluster.name))
#                 Azure.connectToCluster(rg, cluster)
#                 # Helm.odinHelmSetup(None, None)
#                 mu.updateStatus("service", deploymentId, str(UpdateService.ClusterConnectionSuccess.name))
#         except Exception as ex:
#             mu.updateStatus("service", deploymentId, str(UpdateService.ClusterConnectionFailed.name), str(ex))
#             logger.exception(ex)

#         serviceDB = mu.find_by_id("service", deploymentId)

#         try:
#             if (serviceDB["status"] == str(UpdateService.ClusterConnectionSuccess.name)):
#                 mu.updateStatus("service", deploymentId, str(UpdateService.UpdatingService.name))
#                 # Helm
#                 chartName = Utils.getService(serviceDB["serviceId"])
#                 Helm.updateService(serviceDB["serviceName"], chartName, data["values"])
#                 mu.updateValues("service", deploymentId, str(data["values"]))
#                 mu.updateStatus("service", deploymentId, str(UpdateService.Completed.name))
#                 message.complete()
#         except Exception as ex:
#             mu.updateStatus("service", deploymentId, str(UpdateService.UpdateFailed.name), str(ex))
#             logger.exception(ex)
#             message.complete()

#     # api-updateService 
#     @staticmethod
#     def startWorkflow(message: Message):
#         try:
#             logger.info(".....start workflow path.....")
#             ServiceBusUtil.azureLogin()
#             messageString = str(message.message)
#             deploymentId = (message.properties.message_id).decode('utf-8')
#             mu.updateStatus("service", deploymentId, str(UpdateService.UpdateServiceAccepted.name))
#             message.complete()
#             ServiceBusUtil.sendQueueMessage("success-updateService", messageString, deploymentId, "str",
#                                             str(UpdateService.UpdateServiceAccepted.name))
#         except Exception as ex:
#             mu.save("FailedWorkflows", str(message.message))
#             logger.info(ex)
#             message.complete()

# from util.azure import Azure
# import util.mongoUtil as mu
# from util.utilityHelpers import Utils
# from models.db.service import ServiceModel
# from models.enums.workflows import DeleteService
# from azure.servicebus import Message
# import util.serviceBusUtil as ServiceBusUtil
# from util.helm import Helm
# import time
# import logging

# logger = logging.getLogger("ODIN")


# class ServiceDelete:

#     # success-deleteService
#     @staticmethod
#     def startSuccessWorkflow(message: Message):
#         logger.info(".....success workflow path.....")
#         deploymentId = (message.properties.message_id).decode('utf-8')
#         serviceDB = mu.find_by_id("service", deploymentId)
#         workspaceDB = mu.find_by_id("workspace", serviceDB["workspaceId"])
#         rg = workspaceDB["resourceGroupName"]
#         cluster = workspaceDB["clusterName"]
#         if (serviceDB["status"] == str(DeleteService.Deleted.name)):
#             message.complete()

#         try:
#             if (serviceDB["status"] == str(DeleteService.DeleteServiceAccepted.name)):
#                 mu.updateStatus("service", deploymentId, str(DeleteService.ConnectingToCluster.name))
#                 Azure.connectToCluster(rg, cluster)
#                 # Helm.odinHelmSetup(None, None)
#                 mu.updateStatus("service", deploymentId, str(DeleteService.ClusterConnectionSuccess.name))
#         except Exception as ex:
#             mu.updateStatus("service", deploymentId, str(DeleteService.ClusterConnectionFailed.name), str(ex))
#             logger.exception(ex)

#         serviceDB = mu.find_by_id("service", deploymentId)

#         try:
#             if (serviceDB["status"] == str(DeleteService.ClusterConnectionSuccess.name)):
#                 mu.updateStatus("service", deploymentId, str(DeleteService.DeletingService.name))
#                 # Helm
#                 Helm.deleteService(serviceDB["serviceName"])
#                 mu.updateStatus("service", deploymentId, str(DeleteService.DeletedService.name))
#         except Exception as ex:
#             mu.updateStatus("service", deploymentId, str(DeleteService.DeletingServiceFailed.name), str(ex), True)
#             logger.exception(ex)
#             message.complete()

#         serviceDB = mu.find_by_id("service", deploymentId)

#         try:
#             if (serviceDB["status"] == str(DeleteService.DeletedService.name)):
#                 mu.updateStatus("service", deploymentId, str(DeleteService.DNSEntryDelete.name))
#                 # Azure
#                 Azure.deleteDNSZoneEntry(cluster, rg, serviceDB["serviceName"])
#                 mu.updateStatus("service", deploymentId, str(DeleteService.Deleted.name))
#                 message.complete()
#         except Exception as ex:
#             mu.updateStatus("service", deploymentId, str(DeleteService.DNSEntryDeleteFailed.name), str(ex), True)
#             logger.exception(ex)
#             message.complete()

#     # api-deleteService
#     @staticmethod
#     def startWorkflow(message: Message):
#         try:
#             logger.info(".....start workflow path.....")
#             ServiceBusUtil.azureLogin()
#             messageString = str(message.message)
#             deploymentId = (message.properties.message_id).decode('utf-8')
#             mu.updateStatus("service", deploymentId, str(DeleteService.DeleteServiceAccepted.name))
#             message.complete()
#             ServiceBusUtil.sendQueueMessage("success-deleteService", messageString, deploymentId, "str",
#                                             str(DeleteService.DeleteServiceAccepted.name))
#         except Exception as ex:
#             mu.save("FailedWorkflows", str(message.message))
#             logger.exception(ex)
#             message.complete()

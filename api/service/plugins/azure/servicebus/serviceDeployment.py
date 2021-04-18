from util.azure import Azure
import util.mongoUtil as mu
from util.utilityHelpers import Utils
from models.db.service import ServiceModel
from models.enums.workflows import DeployService
from azure.servicebus import Message
import util.serviceBusUtil as ServiceBusUtil
from util.helm import Helm
import time
import logging

logger = logging.getLogger("ODIN")


class ServiceDeployment:

    # success-deployService
    @staticmethod
    def startSuccessWorkflow(message: Message):
        logger.info(".....success workflow path.....")
        messageString = str(message.message)
        data = Utils.getJson(messageString)
        workspaceDB = mu.find_by_id("workspace", data["workspaceID"])
        rg = workspaceDB["resourceGroupName"]
        cluster = workspaceDB["clusterName"]
        deploymentId = (message.properties.message_id).decode('utf-8')

        serviceDB = mu.find_by_id("service", deploymentId)

        if (serviceDB["status"] == str(DeployService.Completed.name)):
            message.complete()

        try:
            if (serviceDB["status"] == str(DeployService.DeployServiceAccepted.name)):
                mu.updateStatus("service", deploymentId, str(DeployService.ConnectingToCluster.name))
                Azure.connectToCluster(rg, cluster)
                # Helm.odinHelmSetup(None, None)
                mu.updateStatus("service", deploymentId, str(DeployService.ClusterConnectionSuccess.name))
        except Exception as ex:
            mu.updateStatus("service", deploymentId, str(DeployService.ClusterConnectionFailed.name), str(ex))
            logger.exception(ex)

        serviceDB = mu.find_by_id("service", deploymentId)

        try:
            if (serviceDB["status"] == str(DeployService.ClusterConnectionSuccess.name)):
                mu.updateStatus("service", deploymentId, str(DeployService.DeployingService.name))
                # Helm
                chartName = Utils.getService(data["serviceId"])
                Helm.deployService(serviceDB["serviceName"], chartName, data["values"])
                mu.updateStatus("service", deploymentId, str(DeployService.DeployingServiceCompleted.name))
        except Exception as ex:
            mu.updateStatus("service", deploymentId, str(DeployService.DeployingServiceFailed.name), str(ex))
            logger.exception(ex)
            message.complete()

        serviceDB = mu.find_by_id("service", deploymentId)

        try:
            if (serviceDB["status"] == str(DeployService.DeployingServiceCompleted.name)):
                mu.updateStatus("service", deploymentId, str(DeployService.CreatingDNSEntry.name))
                # Azure
                loadBalancerIp, url = Azure.addDNSZoneEntry(cluster, rg, serviceDB["serviceName"])
                mu.updateEndPoint("service", deploymentId, url, loadBalancerIp)
                mu.updateStatus("service", deploymentId, str(DeployService.Completed.name))
                # Utils.pollWebsite(url)
                message.complete()
        except Exception as ex:
            mu.updateStatus("service", deploymentId, str(DeployService.CreatingDNSEntryFailed.name), str(ex))
            logger.exception(ex)
            message.complete()

    # api-deployService
    @staticmethod
    def startWorkflow(message: Message):
        try:
            logger.info(".....start workflow path.....")
            ServiceBusUtil.azureLogin()
            messageString = str(message.message)
            data = Utils.getJson(messageString)
            deploymentId = (message.properties.message_id).decode('utf-8')
            serviceModel: ServiceModel = {
                "_id": deploymentId,
                "userId": data["userId"],
                "workspaceId": data["workspaceID"],
                "values": str(data["values"]),
                "serviceId": data["serviceId"],
                "serviceName": data["releaseName"] + "-" + data["env"],
                "status": str(DeployService.DeployServiceAccepted.name),
                "endPoint": "",
                "endPointIp": "",
                "createdAt": int(time.time()),
                "updatedAt": int(time.time())
            }
            logger.info(serviceModel)
            mu.save("service", serviceModel)
            message.complete()
            ServiceBusUtil.sendQueueMessage("success-deployService", messageString, deploymentId, "str",
                                            str(DeployService.DeployServiceAccepted.name))
        except Exception as ex:
            mu.save("FailedWorkflows", str(message.message))
            logger.exception(ex)
            message.complete()

from service.plugins.azure.servicebus.workspaceDeployment import WorkspaceDeployment
from service.plugins.azure.servicebus.workspaceDelete import WorkspaceDelete
from service.plugins.azure.servicebus.serviceDeployment import ServiceDeployment
from service.plugins.azure.servicebus.serviceUpdate import ServiceUpdate
from service.plugins.azure.servicebus.serviceDelete import ServiceDelete
import logging
from azure.servicebus.common.errors import MessageLockExpired
from azure.servicebus import Message

logger = logging.getLogger("ODIN")


class ServiceBusActions:

    @staticmethod
    def triggerAction(queueName, message: Message):
        try:
            # DO NOT OPEN THIS OTHERWISE ALL MESSAGES WILL BE DELETED

            # logger.info("...moving to dead_letter MESSAGES...")
            # message.dead_letter()
            # return

            # DO NOT OPEN THIS OTHERWISE ALL MESSAGES WILL BE DELETED
            if (queueName == "api-deployWorkspace"):
                WorkspaceDeployment.startWorkflow(message)
            elif (queueName == "success-deployWorkspace"):
                WorkspaceDeployment.startSuccessWorkflow(message)
            elif (queueName == "api-deleteWorkspace"):
                WorkspaceDelete.startWorkflow(message)
            elif (queueName == "success-deleteWorkspace"):
                WorkspaceDelete.startSuccessWorkflow(message)
            elif (queueName == "api-deployService"):
                ServiceDeployment.startWorkflow(message)
            elif (queueName == "success-deployService"):
                ServiceDeployment.startSuccessWorkflow(message)
            elif (queueName == "api-deleteService"):
                ServiceDelete.startWorkflow(message)
            elif (queueName == "success-deleteService"):
                ServiceDelete.startSuccessWorkflow(message)
            elif (queueName == "api-updateService"):
                ServiceUpdate.startWorkflow(message)
            elif (queueName == "success-updateService"):
                ServiceUpdate.startSuccessWorkflow(message)
            else:
                logger.info("No action for Queue: {q} Message: {m}".format(m=str(message.message), q=queueName))
        except Exception as ex:
            if (ex == MessageLockExpired):
                logger.exception("triggerAction: Exception - Lock expired on servicebus message - " + str(ex))
            else:
                logger.exception("triggerAction: Exception - {ex}".format(ex))

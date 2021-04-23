import sys
import os
import json
import logging
from azure.servicebus import ServiceBusClient, Message, AutoLockRenew
from multiprocessing import Process
from util.utilityHelpers import Utils
from util.servicebusActions import ServiceBusActions
import datetime
from util.azure import Azure

queue_receiver_process: dict = {}
logger = logging.getLogger("ODIN")
allQueues = [
    "api-deployWorkspace", "success-deployWorkspace",
    "api-deleteWorkspace", "success-deleteWorkspace",
    "api-deployService", "success-deployService",
    "api-deleteService", "success-deleteService",
    "api-updateService", "success-updateService"
]

def azureLogin():
    Azure.azLogin()

def connect():
    # try:
    #     connectionString = Azure.getSecretFromKeyVault("","")
    # except Exception as ex:
    #     raise ex
    connectionString = "Endpoint=sb://kaiyotest.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XGnBQA6hlEZlhVGBk879GxW68hAPgAuXtmA3c6o9Afk="
    client = ServiceBusClient.from_connection_string(connectionString)
    return client


# not for free tier
# https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-resource-manager-exceptions
def createQueue(queueName):
    client = connect()
    client.create_queue(queueName,
                        max_size_in_megabytes=1024,
                        max_delivery_count=3,
                        lock_duration=(3 * 60))


def getQueueClient(queueName):
    client = connect()
    queue_client = client.get_queue(queueName)
    return queue_client


def sendQueueMessage(queueName, message, messageId, content_type="application/json", to=""):
    msg = Message(message)
    msg.properties.message_id = messageId
    msg.annotations = {}
    msg.annotations[Message._X_OPT_LOCKED_UNTIL] = 1000 * 1000
    msg.properties.to = to
    msg.properties.content_type = content_type
    queue_client = getQueueClient(queueName)
    with queue_client.get_sender() as sender:
        sender.send(msg)


def receiveQueueMessage(queueName):
    queue_client = getQueueClient(queueName)
    autoRenew = AutoLockRenew()
    with queue_client.get_receiver() as messages:
        for message in messages:
            autoRenew.register(message, 700)
            ServiceBusActions.triggerAction(queueName, message)


def startReceiverQueue(queueName):
    logger.info("Listening {queueName}".format(queueName=queueName))
    p = Process(target=receiveQueueMessage, args=(queueName,))
    queue_receiver_process[queueName] = p
    p.start()


def stopReceiverQueue(queueName):
    p: Process = queue_receiver_process[queueName]
    p.terminate()


def listenToQueues(queues):
    try:
        for q in queues:
            startReceiverQueue(q)
    except Exception as ex:
        logger.exception("listenToQueues Exception: " + str(ex))
        raise ex

def createAllQueues():
    for q in allQueues:
        createQueue(q)
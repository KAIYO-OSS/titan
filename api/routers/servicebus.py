from fastapi import APIRouter
import util.serviceBusUtil as ServiceBusUtil
import uuid
router = APIRouter()


@router.get("/servicebus/healthcheck/", tags=["servicebus"])
async def health_check():
    return {"message": "Hello World"}


@router.get("/servicebus/create/{queueName}/", tags=["servicebus"])
async def create_service_bus_queue(queueName: str):
    try:
        ServiceBusUtil.createQueue(queueName)
        return {
            "status": "200",
            "metadata": {
                "queueName":queueName
            }, 
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "create_service_bus_queue failed: " + str(ex)
        }

@router.get("/servicebus/startall/", tags=["servicebus"])
async def start_all_service_bus_queue():
    try:
        ServiceBusUtil.listenToQueues(ServiceBusUtil.allQueues)
        return {
            "status": "200",
            "metadata": {
                "queueNames":ServiceBusUtil.allQueues
            }, 
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "start_all_service_bus_queue failed: " + str(ex)
        }

@router.get("/stopall/servicebus/", tags=["servicebus"])
async def stop_all_service_bus_queue():
    try:
        for q in ServiceBusUtil.allQueues:
            ServiceBusUtil.stopReceiverQueue(q)
        return {
            "status": "200",
            "metadata": {
                "queueNames":ServiceBusUtil.allQueues
            }, 
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "stop_all_service_bus_queue failed: " + str(ex)
        }
        
@router.get("/servicebus/start/{queueName}/", tags=["servicebus"])
async def start_service_bus_queue(queueName: str):
    try:
        ServiceBusUtil.startReceiverQueue(queueName)
        return {
            "status": "200",
            "metadata": {
                "queueName":queueName
            }, 
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "start_service_bus_queue failed: " + str(ex)
        }

@router.get("/servicebus/stop/{queueName}/", tags=["servicebus"])
async def stop_service_bus_queue(queueName: str):
    try:
        ServiceBusUtil.stopReceiverQueue(queueName)
        return {
            "status": "200",
            "metadata": {
                "queueName":queueName
            }, 
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "stop_service_bus_queue failed: " + str(ex)
        }

@router.get("/servicebus/send/{queueName}/{message}", tags=["servicebus"])
async def send_service_bus(queueName: str, message: str):
    try:
        messageId = str(uuid.uuid4())
        ServiceBusUtil.sendQueueMessage(queueName, message,messageId, "str")
        return {
            "status": "200",
            "metadata": {
                "queueName":queueName,
                "message":message
            },
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "send_service_bus failed: " + str(ex)
        }

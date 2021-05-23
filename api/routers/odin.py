import json

from fastapi import APIRouter
from util.helm import Helm
from models.deployRequest import DeployRequest
from util.utilityHelpers import Utils

router = APIRouter()


@router.post("/odin/service/", tags=["odin"])
async def deploy_service(deploy_request: DeployRequest):
    try:
        Helm.odinHelmSetup()
        output = Utils.getJson(Helm.deployService(deploy_request.service_name,
                                                   deploy_request.chart_name, deploy_request.values))
        return {
            "status": "200",
            "metadata": output,
            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "error": "Service deployment failed: " + str(ex)
        }


@router.delete("/odin/service/{service_name}", tags=["odin"])
async def delete_service(service_name):
    try:
        Helm.deleteService(service_name)
        return {
            "status": "200",

            "error": ""
        }
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Service delete failed: " + str(ex)
        }


@router.get("/odin/service/{service_name}", tags=["odin"])
async def get_status(service_name):
    try:
        status = Utils.getJson(Helm.getServiceStatus(service_name))
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
        service_list = Utils.getJson(Helm.listAllServices())
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

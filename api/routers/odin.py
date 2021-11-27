import json

from fastapi import APIRouter, HTTPException
from util.helm import Helm
from models.deployRequest import DeployRequest
from models.rollbackRequest import RollbackRequest
from util.utilityHelpers import Utils
import etcd3

router = APIRouter()
etcd = etcd3.client()


@router.post("/odin/service/", tags=["odin"])
async def deploy_service(deploy_request: DeployRequest):
    try:
        Helm.odinHelmSetup()
        output = Utils.getJson(Helm.deployService(deploy_request.service_name,
                                                  deploy_request.chart_name, deploy_request.values))
        service_list = Utils.getJson(Helm.listAllServices())
        etcd.put('service_list', json.dumps(service_list))
        return {
            "status": "200",
            "metadata": output,
            "error": ""
        }
    except Exception as ex:
        raise HTTPException(
            status_code=500, detail="Service deployment failed: " + str(ex))


@router.delete("/odin/service/{service_name}", tags=["odin"])
async def delete_service(service_name):
    try:
        Helm.deleteService(service_name)
        service_list = Utils.getJson(Helm.listAllServices())
        etcd.put('service_list', json.dumps(service_list))
        return {
            "status": "200",

            "error": ""
        }
    except Exception as ex:
        raise HTTPException(
            status_code=500, detail="Service delete failed: " + str(ex))


@router.get("/odin/service/{service_name}/status", tags=["odin"])
async def get_status(service_name):
    try:
        status = Utils.getJson(Helm.getServiceStatus(service_name))
        values = Utils.getJson(Helm.getServiceValues(service_name))
        revisions = Utils.getJson(Helm.getServiceRevisions(service_name))
        return {
            "status": "200",
            "metadata": status,
            "values": values,
            "revisions": revisions,
            "error": ""
        }
    except Exception as ex:
        raise HTTPException(
            status_code=500, detail="Failed to fetch Service Status: " + str(ex))


@router.get("/odin/service/{service_name}/revisions", tags=["odin"])
async def get_revisions(service_name):
    try:
        revisions = Utils.getJson(Helm.getServiceRevisions(service_name))
        return {
            "status": "200",
            "revisions": revisions,
            "error": ""
        }
    except Exception as ex:
        raise HTTPException(
            status_code=500, detail="Failed to fetch Service Revisions: " + str(ex))


@router.post("/odin/service/rollback", tags=["odin"])
async def rollback_service(rollback_request: RollbackRequest):
    try:
        Helm.odinHelmSetup()
        Helm.rollbackService(
            rollback_request.service_name, rollback_request.revision)
        return {
            "status": "200",
            "metadata": "Rolled back successfully",
            "error": ""
        }
    except Exception as ex:
        raise HTTPException(
            status_code=500, detail="Service deployment failed: " + str(ex))


@router.get("/odin/services/", tags=["odin"])
async def get_all_services():
    try:
        # service_list = Utils.getJsonValue(etcd, 'service_list')
        service_list = Utils.getJson(Helm.listAllServices())
        return {
            "status": "200",
            "metadata": service_list,
            "error": ""
        }
    except Exception as ex:
        raise HTTPException(
            status_code=500, detail="Failed to fetch all services: " + str(ex))

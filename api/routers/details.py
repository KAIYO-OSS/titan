from fastapi import APIRouter
from util.utilityHelpers import Utils
import util.mongoUtil as mu
router = APIRouter()


@router.get("/details/workspace/info/{workspaceId}", tags=["details"])
async def worksapce_information(workspaceId: str):
    try:
        return mu.find_by_id("workspace", workspaceId)
    except Exception as ex:
        return ex

@router.get("/details/workspaces/{userId}", tags=["details"])
async def all_user_workspaces(userId: str):
    try:
        return mu.find_by_userId("workspace", userId)
    except Exception as ex:
        return ex

@router.get("/details/services/{workspaceId}", tags=["details"])
async def all_user_services_in_workspace(userId: str):
    try:
        return mu.find_by_workspace("service", workspaceId)
    except Exception as ex:
        return ex

@router.get("/details/deployments/{userId}", tags=["details"])
async def all_user_deployment(userId: str):
    try:
        return mu.find_by_userId("service", userId)
    except Exception as ex:
        return ex

@router.get("/details/service/info/{deploymentId}", tags=["details"])
async def service_information(deploymentId: str):
    try:
        return mu.find_by_id("service", deploymentId)
    except Exception as ex:
        return ex

@router.get("/details/service/configuration/{deploymentId}", tags=["details"])
async def current_configuration(deploymentId: str):
    try:
        service = mu.find_by_id("service", deploymentId)
        return Utils.getJson(service["values"])
    except Exception as ex:
        return ex


@router.get("/details/service/configurationall", tags=["details"])
async def all_configuration():
    return {"message": "Hello World"}

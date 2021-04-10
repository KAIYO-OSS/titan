from fastapi import APIRouter
import util.mongoUtil as mu
router = APIRouter()

@router.get("/polling/deploy/workspace/{workspaceId}", tags=["polling"])
async def polling_create_workspace(workspaceId: str):
    # check in db status and enums for user
    try:
        return mu.find_by_id("workspace", workspaceId)
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Workspace create polling failed: " + str(ex)
        }

@router.get("/polling/remove/workspace/{workspaceId}", tags=["polling"])
async def polling_delete_workspace(workspaceId: str):
    # check in db status and enums for user
    try:
        return mu.find_by_id("workspace", workspaceId)
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "Workspace delete polling failed: " + str(ex)
        }

@router.get("/polling/deploy/service/{deploymentId}", tags=["polling"])
async def polling_deploy_service(deploymentId: str):
    # check in db status and enums for user
    try:
        return mu.find_by_id("service", deploymentId)
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "service deploy polling failed: " + str(ex)
        }

@router.get("/polling/update/service/{deploymentId}", tags=["polling"])
async def polling_update_service(deploymentId: str):
    # check in db status and enums for user
    try:
        return mu.find_by_id("service", deploymentId)
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "service deploy polling failed: " + str(ex)
        }


@router.get("/polling/delete/service/{deploymentId}", tags=["polling"])
async def polling_delete_service(deploymentId: str):
    # check in db status and enums for user
    try:
        return mu.find_by_id("service", deploymentId)
    except Exception as ex:
        return {
            "status": "500",
            "metadata": {},
            "error": "service deploy polling failed: " + str(ex)
        }
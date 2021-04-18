from pydantic.main import BaseModel
import json

class WorkspaceModel(BaseModel):
    _id: str
    userId: str
    provider: str
    createdAt: int
    updatedAt: int
    status: int
    resourceGroupName: str
    rgLocation: str
    vmSize: str
    clusterName: str
    nodeCount: str
    clusterType: str
    exception: str
    toBeDeleted: bool

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)
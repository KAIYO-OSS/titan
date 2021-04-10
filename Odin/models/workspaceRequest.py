from pydantic.main import BaseModel
import json

class WorkspaceRequest(BaseModel):
    userId: str
    provider: str
    resourceGroup: str
    resourceGroupLocation: str
    clusterName: str
    nodeCount: int
    clusterType: str
    
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)

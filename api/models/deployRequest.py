from pydantic.main import BaseModel
import json

class DeployRequest(BaseModel):
    userId: str
    workspaceID: str
    serviceId: str
    releaseName: str 
    values: dict 
    env: str
    ttl: int

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
        sort_keys=True, indent=4)
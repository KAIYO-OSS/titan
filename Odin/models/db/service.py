from pydantic.main import BaseModel
import json

class ServiceModel(BaseModel):
    _id: str
    userId: str
    workspaceId: str
    createdAt: int
    updatedAt: int
    status: int
    values: str
    serviceId: str
    serviceName: str
    endPoint: str
    endPointIp: str
    exception: str
    toBeDeleted: bool

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)
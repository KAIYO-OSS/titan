from pydantic.fields import Optional
from pydantic.main import BaseModel
import json


class DeployRequest(BaseModel):
    acl_token: str
    # workspaceID: str
    chart_name: str
    service_name: str
    values: Optional[dict]

    # env: str
    # ttl: int

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)

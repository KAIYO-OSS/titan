from pydantic import BaseModel
import json

class UpdateRequest(BaseModel):
    deploymentId: str
    values: dict
    ttl: int

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
        sort_keys=True, indent=4)

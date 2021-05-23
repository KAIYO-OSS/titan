from pydantic import BaseModel
import json


class KubeConfigRequest(BaseModel):
    userId: str
    configString: str

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)

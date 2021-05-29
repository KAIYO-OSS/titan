from pydantic.fields import Optional
from pydantic.main import BaseModel
import json


class RollbackRequest(BaseModel):
    service_name: str
    revision: int

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)

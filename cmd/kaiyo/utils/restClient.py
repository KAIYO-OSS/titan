import requests
from .helpers import Utils
import logging
import json

def sendRequest(reqType="GET",url="https://www.google.com",headers={},payload=None):
    try:
        headers['Content-Type']='application/json'
        data = None
        if(payload!=None):
            data = json.dumps(payload)
        response = requests.request(reqType, url, headers=headers, data=data)
        res = ""
        if(response!=None and response.text!=None):
            try:
                res = Utils.getJson(response.text)
            except:
                res = response.text
        print("sendRequest:" , res)
        return res,response.status_code,response.headers
    except Exception as ex:
        raise Exception("Exception in sendRequest {ex}".format(ex=ex))
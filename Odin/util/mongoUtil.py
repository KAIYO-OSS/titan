from pymongo import MongoClient
import time
from util.azure import Azure

def get_connection(document_index):
    # try:
    #     url = Azure.getSecretFromKeyVault("","")
    # except Exception as ex:
    #     raise ex
    url = "mongodb://kaiyo:9CBqAlXMe1sAdices0EWfyTBnozeKZZ3zlyh3LC6i7QTkb3eM0Hk5p8ENnir2OI93FUIBtUImbHZYVWHI1VI3w==@kaiyo.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@kaiyo@"
    database = "kaiyo"
    client = MongoClient(url)
    db = client[database]
    return db[document_index]


def save(index, data):
    db = get_connection(index)
    ins = db.insert_one(data)
    return ins


def find_by_id(index, id):
    db = get_connection(index)
    ins = db.find_one({'_id': id})
    return ins

def find_by_workspace(index, id):
    db = get_connection(index)
    ins = db.find({'workspaceId': id})
    return list(ins)

def find_by_userId(index, id):
    db = get_connection(index)
    ins = db.find({'userId': id})
    return list(ins)

def delete_by_id(index, id):
    db = get_connection(index)
    ins = db.find_one_and_update({'_id': id, 'status': 'deleted'})
    return ins

def updateStatus(document, id, status, exception = "", toBeDeleted = False):
    get_connection(document).update_one(
        {
        "_id" : id 
        },
        {"$set": 
            {
             "status": status,
             "exception": exception,
             "toBeDeleted": toBeDeleted,
             "updatedAt": int(time.time())
            }
        }, upsert=False)

def updateEndPoint(document, id, endPoint,endPointIp=""):
    get_connection(document).update_one(
        {
        "_id" : id 
        },
        {
        "$set": 
            {
             "endPoint": endPoint,
             "endPointIp":endPointIp
            }
        }, upsert=False)

def updateValues(document, id, values):
    get_connection(document).update_one(
        {
        "_id" : id 
        },
        {
        "$set": 
            {
             "values": values
            }
        }, upsert=False)
import websocket
from .clickUtils import userinput, userListInput
from .restClient import sendRequest
from .configUtil import getDefaultProfile
from .helpers import Utils

bifrost = "http://692875484b5a.ngrok.io/"

def isLoggedIn(token):
    isSessionValid = sessionCheckBifrost()
    if(not isSessionValid):
        raise Exception("Please use 'kaiyo login' to update your credentials and then try again.")

def checkIfBillingCompleted(token):
    isBillPaid = checkBillingCompleteBifrost()
    if(not isBillPaid):
        raise Exception("Please pay your bill first and then try again.")

def setProfile(profile):
    try:
        profile = getDefaultProfile(profile)
        token = profile["token"]
        isLoggedIn(token)
        # checkIfBillingCompleted(token)
    except Exception as ex:
        Exception("Exception in setProfile {ex}".format(ex=ex))

def getLogs(id):
    url,port,token = "", "", ""
    # conenct with pheme
    ws = websocket.conenct("ws://localhost:5000/ws/log")
    print("Sending 'Hello, World'...")
    ws.send("Hello, World")
    while ws.connected:
        result =  ws.recv()
        print(result)
    ws.close()

def createWorkspace(workspaceName):
    clusterType = userListInput(["Small","Medium","Large"], "Select size for your workspace")
    provider = "azure" #userListInput(["Azure"])
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    data = {
    "userId": userid,
    "provider": provider,
    "resourceGroup": workspaceName,
    "resourceGroupLocation": "eastus",
    "clusterName": workspaceName+"-cluster",
    "nodeCount": "1",
    "clusterType": str.lower(clusterType)
    }
    resp = sendRequest("POST","{bifrost}/deploy/workspace".format(bifrost=bifrost),{"x-access-token":token},data)
    return resp

def viewWorkspace(workspaceId):
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    resp = sendRequest("GET","{bifrost}/workspace/{workspaceId}".format(bifrost=bifrost,workspaceId=workspaceId),{"x-access-token":token})
    return resp

def deleteWorkspace(workspaceId):
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    resp = sendRequest("DELETE","{bifrost}/workspace/{workspaceId}".format(bifrost=bifrost,workspaceId=workspaceId),{"x-access-token":token})
    return resp

def viewAllWorkspaces():
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    data = [userid]
    resp = sendRequest("GET","{bifrost}/workspaces".format(bifrost=bifrost),{"x-access-token":token},data)
    return resp

def viewService(deploymentId):
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    resp = sendRequest("GET","{bifrost}/service/{deploymentId}".format(bifrost=bifrost,deploymentId=deploymentId),{"x-access-token":token})
    return resp

def viewAllServices():
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    resp = sendRequest("GET","{bifrost}/deployments/{userid}".format(bifrost=bifrost,userid=userid),{"x-access-token":token})
    return resp

def viewAllServicesInWorksapces(workspaceId):
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    resp = sendRequest("GET","{bifrost}/services/{workspaceId}".format(bifrost=bifrost,workspaceId=workspaceId),{"x-access-token":token})
    return resp

def deleteService(deploymentId):
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    resp = sendRequest("DELETE","{bifrost}/service/{deploymentId}".format(bifrost=bifrost,deploymentId=deploymentId),{"x-access-token":token})
    return resp

def deployService(build):
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    workspaceid = userinput("Please enter workspace id")
    serviceName = userinput("Please your application name")
    env = userListInput(["Staging", "Production", "Testing"],"Select enviroment for your application")
    servicetype = userListInput(["Nginx","Mongodb","Redis","OtherServices"],"Select type of application")
    if(servicetype == "Nginx"):
        servicetypeid = 1
    elif(servicetype == "Mongodb"):
        servicetypeid = 2
    elif(servicetype == "Redis"):
        servicetypeid = 3
    else:
        servicetypeid = 4
    ttl = 1 #userinput("Please enter time limit for your application")
    values: dict = {}
    valuestring = userinput("Please enter json of arguments for deploying your service")
    if(valuestring!=None or valuestring!="{}"):
        values = Utils.getJson(valuestring)
    values["image.tag"] = build
    data = {
    "userid": userid,
    "workspaceID": workspaceid,
    "serviceId": str(servicetypeid),
    "releaseName": serviceName,
    "values": values,
    "env": env,
    "ttl": ttl
    }
    resp = sendRequest("POST","{bifrost}/deploy/service".format(bifrost=bifrost),{"x-access-token":token},data)
    return resp

def updateService(deploymentId):
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    ttl = 1
    values: dict = {}
    valuestring = userinput("Please enter updated json of arguments for deploying your service")
    if(valuestring!=None or valuestring!="{}"):
        values = Utils.getJson(valuestring)
    data = {
    "deploymentId": deploymentId,
    "values": values,
    "ttl": ttl
    }
    resp = sendRequest("PUT","{bifrost}/update/service".format(bifrost=bifrost),{"x-access-token":token},data)
    return resp

def pollWorkspaceStatus(workspaceid):
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    resp = sendRequest("GET","{bifrost}/status/workspace/{workspaceid}".format(bifrost=bifrost,workspaceid=workspaceid),{"x-access-token":token})
    return resp
    
def pollServiceStatus(deploymentId):
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    resp = sendRequest("GET","{bifrost}/status/service/{deploymentId}".format(bifrost=bifrost,deploymentId=deploymentId),{"x-access-token":token})
    return resp

def getBillWithUserId():
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    resp = sendRequest("GET","{bifrost}/billing/getBill/{userid}".format(bifrost=bifrost,userid=userid),{"x-access-token":token})
    return resp

def checkBillingCompleteBifrost():
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    resp,code = sendRequest("GET","{bifrost}/billing/checkBillingComplete/{userid}".format(bifrost=bifrost,userid=userid),{"x-access-token":token})
    isBillPaid = False
    if(resp["isBillCompleted"] != None and resp["isBillCompleted"] != ""):
        isBillPaid = resp["isBillCompleted"]
    return isBillPaid

def sessionCheckBifrost():
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    resp,code = sendRequest("GET","{bifrost}/sessionCheck".format(bifrost=bifrost),{"x-access-token":token})
    if(str(code)=="200"):
        return True
    return False

def signup():
    email = userinput("Enter email")
    password = userinput("Enter password")
    firstName = userinput("Enter first name")
    middleName = userinput("Enter middle name")
    lastName = userinput("Enter last name")
    countryCode = userinput("Enter country code")
    dateOfBirth = userinput("Enter DOB")
    occupation = userinput("Enter occupation")
    companyName = userinput("Enter company")
    sex = userinput("Enter sex")
    securityQuestion = userinput("Enter security question")
    securityQuestionAnswer = userinput("Enter security question answer")
    phoneNumber = userinput("Enter mobile number")
    subscriptionMode = userinput("Enter subscription mode")
    joiningMode = userinput("Enter joining mode")
    data = {
    "password":password,
    "firstName":firstName,
    "middleName":middleName,
    "lastName":lastName,
    "emailAddress":email,
    "companyName":companyName,
    "occupation":occupation,
    "dateOfBirth":dateOfBirth,
    "securityQuestion":securityQuestion,
    "securityQuestionAnswer":securityQuestionAnswer,
    "sex":sex,
    "countryCode":countryCode,
    "phoneNumber":phoneNumber,
    "emailAddressVerified":False,
    "active":False,
    "verified":False,
    "subscriptionMode": subscriptionMode,
    "joiningMode": joiningMode
    }
    resp = sendRequest("POST","{bifrost}/createUser".format(bifrost=bifrost),{},data)
    return resp

def login(email,password):
    data = {
    "emailAddress": email,
    "password": password
    }
    resp, code, headers = sendRequest("POST","{bifrost}/login".format(bifrost=bifrost),{},data)
    return resp["userId"], headers["x-access-token"]

def logout():
    profile = getDefaultProfile()
    userid = profile["info"]["name"]
    token = profile["token"]
    resp,code,headers = sendRequest("POST","{bifrost}/logout".format(bifrost=bifrost),{"x-access-token":token})
    return resp
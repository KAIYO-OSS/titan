import sys
from pathlib import Path
import os
import json

def isValidProfile(profilename):
    if(profilename == "" or profilename == None):
        return False
    return True
    
def getKaiyoConfigPath():
    home = str(Path.home())
    path = home +"/kaiyoconfig.json"
    return path

def getProfiles():
    try:
        path = getKaiyoConfigPath()
        if not os.path.exists(path):
            raise Exception("Please do kaiyo login first.")
        with open(path) as f:
            data = json.load(f)
            profilearr: list = data["config"]["profiles"]
            return profilearr
    except Exception as ex:
        Exception("Exception in getProfiles {ex}".format(ex=ex))

def getDefaultProfile(profile=None):
    try:
        path = getKaiyoConfigPath()
        if not os.path.exists(path):
            raise Exception("Please do kaiyo login first.")
        with open(path) as f:
            data = json.load(f)
            if(profile!=None and profile!=""):
                profileName = profile
            else:
                profileName = data["config"]["default"]
            profilearr: list = data["config"]["profiles"]
            for profile in profilearr:
                if(profile["profilename"] == profileName):
                    found = True
                    return profile
            if(found==False):
                raise Exception("Profile does not exist. Please do kaiyo login first.")
    except Exception as ex:
        Exception("Exception in getDefaultProfile {ex}".format(ex=ex))

def createNewkaiyoConfigFile():
    path = getKaiyoConfigPath()
    # Create the kaiyo config if it does not exist
    if not os.path.exists(path):
        open(path, 'w').close()
    # # Open the kaiyo config for appending and reading
    data = {
        "config" : { 
            "default":"",
            "profiles":[
            ]
        }
    }
    with open(path, 'w') as f:
        json.dump(data, f)

# {
# "profilename": "testprofile",
#     "info" : {
#         "name": "test",
#         "extra":{}
#     },
#     "token":"test"
# }
def updateOrAddNewProfile(profiletosubmit,profileName):
    path = getKaiyoConfigPath()
    if not os.path.exists(path):
        createNewkaiyoConfigFile()
    with open(path) as f:
        data = json.load(f)
        profilearr: list = data["config"]["profiles"]
        index = 0
        found = False
        for profile in profilearr:
            if(profile["profilename"] == profileName):
                found = True
                break
            index  = index  + 1
        if found == True:
            data["config"]["profiles"][index]["token"] = profiletosubmit["token"]
        else:
            data["config"]["profiles"].append(profiletosubmit)
        data["config"]["default"] = profileName
    with open(path, 'w') as f:
        json.dump(data, f)
        return data

def deleteProfile(profilename):
    path = getKaiyoConfigPath()
    if not os.path.exists(path):
        return "file does not exist"
    else:
        with open(path) as f:
            data: dict = json.load(f)
            profilearr: list = data["config"]["profiles"]
            index = 0
            found = False
            if(not isValidProfile(profilename)):
                profilename = data["config"]["default"]
                if(not isValidProfile(profilename)):
                    return "profile does not exist"
            
            for profile in profilearr:
                if(profile["profilename"] == profilename):
                    found = True
                    break
                index  = index  + 1
            if found == True:
                data["config"]["profiles"].pop(index)
            else:
                return "profile does not exist"
            profilearr: list = data["config"]["profiles"]
            if(data["config"]["default"] == profilename):
                if(len(profilearr)>0):
                    data["config"]["default"] = profilearr[0]["profilename"]
                else:
                    data["config"]["default"] = ""
        with open(path, 'w') as f:
            json.dump(data, f)
            return data

def changeDefaultProfile(profileName):
    path = getKaiyoConfigPath()
    if not os.path.exists(path):
        return "file does not exist"
    else:
        with open(path) as f:
            data: dict = json.load(f)
            profilearr: list = data["config"]["profiles"]
            found = False
            for profile in profilearr:
                if(profile["profilename"] == profileName):
                    found = True
                    data["config"]["default"] = profileName
        if found == False:
            return "profile does not exist"
        with open(path, 'w') as f:
            json.dump(data, f)
            return data
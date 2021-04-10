import platform
import subprocess
import requests
import json
import logging
import time

logger = logging.getLogger("ODIN")


class Utils:
    # execute shell commands
    @staticmethod
    def executeCommand(listCmds):
        cliType = ""
        if platform.system() == 'Windows':
            cliType = "powershell"
        else:
            cliType = "sh"
        originalCommand = listCmds
        logger.info("runnning command: " + str(originalCommand))
        listCmds = listCmds.split(" ")
        listCmds.insert(0, cliType)
        process = subprocess.Popen(listCmds, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        if process.returncode != 0:
            raise Exception("executeCommand failed:", originalCommand, "STDERR:", stderr, "STDOUT:", stdout)
        else:
            return stdout

    # json utilities
    @staticmethod
    def getJson(json_data):
        try:
            json_object = json.loads(json_data)
            return json_object
        except Exception as ex:
            raise Exception("getJson failed:", json_data, ex)

    # json utilities
    @staticmethod
    def serializeJson(json_data):
        try:
            str_data = json.dumps(json_data, separators=(',', ':'))
            return str_data
        except Exception as ex:
            raise Exception("serializeJson failed:", json_data, ex)

    # to check if website is up
    @staticmethod
    def pollWebsite(url, count=5):
        try:
            if (count > 0):
                response = requests.get(url)
                logger.info("Poll Website - {url} : {response}".format(response=response, url=url))
            else:
                logger.info("Poll Website failed after all retries")
        except requests.ConnectionError as ex:
            logger.info("Poll Website sleep count: {count}".format(count=count))
            time.sleep(5)
            # retrying
            Utils.pollWebsite(url, (count - 1))
        except Exception as ex:
            logger.info("Poll Website failed: {ex}".format(ex=ex))

    @staticmethod
    def getService(serviceId):
        services = {
            "1": "bitnami/nginx",
            "2": "bitnami/mongodb",
            "3": "bitnami/redis",
            "4": "https://kaiyo-oss.github.io/Helm-Charts/servicechart-1.1.0.tgz"
        }
        if (not serviceId in services):
            raise Exception("Service is not supported.")
        return services[serviceId]

    @staticmethod
    def isValidProvider(provider):
        providers = ["azure"]
        if (str.lower(provider) in providers):
            return True
        else:
            raise Exception("Only {providers} providers are supported.", format(providers=providers))

    @staticmethod
    def getVMSize(clusterType):
        if (clusterType == "small"):
            return "Standard_A2_v2"
        elif (clusterType == "medium"):
            return "Standard_A4_v2"
        elif (clusterType == "large"):
            return "Standard_A4m_v2"
        else:
            # small vm
            return "Standard_A2_v2"

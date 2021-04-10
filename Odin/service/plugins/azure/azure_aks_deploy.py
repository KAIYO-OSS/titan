from util.helm import Helm
from util.azure import Azure
import util.mongoUtil as mu
from util.utilityHelpers import Utils
from models.db.service import ServiceModel
from models.db.workspace import WorkspaceModel
import time
import uuid

class OdinUserWorkspaceDeployment:

    def __init__(self, workspaceRequest):
        self.workspaceRequest = workspaceRequest
        self.rg = self.workspaceRequest.resourceGroup
        self.rgLocation = self.workspaceRequest.resourceGroupLocation
        self.cluster = self.workspaceRequest.clusterName
        self.nodeCount = self.workspaceRequest.nodeCount
        self.clusterType = self.workspaceRequest.clusterType
        self.vmSize = Utils.getVMSize(self.clusterType)
        self.workspaceId =  str(uuid.uuid4())
        # initializing db
        self.workspaceModel: WorkspaceModel = {
                "_id" : self.workspaceId,
                "userId" : self.workspaceRequest.userId,
                "provider" : self.workspaceRequest.provider,
                "resourceGroupName" : self.rg,
                "clusterName" : self.cluster,
                "nodeCount" : self.nodeCount,
                "clusterType" : self.clusterType,
                "toBeDeleted": False,
                "exception":"",
                "vmSize":self.vmSize,
                "rgLocation":self.rgLocation
            }

    def deployAzureWorkspace(self):
        try:
            self.workspaceModel.status = "CreatingRG"
            self.workspaceModel.createdAt = int(time.time())
            self.workspaceModel.updatedAt = int(time.time())
            mu.save("workspace",self.workspaceModel)
            Azure.createResourceGroup(self.rg, self.rgLocation)
        except Exception as ex:
            mu.updateStatus("workspace", self.workspaceId, "RGCreationFailed")
            Azure.deleteResourceGroup(self.rg)
            raise ex
        try:
            mu.updateStatus("workspace", self.workspaceId, "CreatingCluster")
            Azure.createAKSCluster(self.rg, self.cluster, self.nodeCount, self.vmSize)
            mu.updateStatus("workspace", self.workspaceId, "Completed")
        except Exception as ex:
            mu.updateStatus("workspace", self.workspaceId, "ClusterCreationFailed")
            raise ex

class OdinUserWorkspaceDelete:
    def __init__(self, workspaceId, rgName, clusterName):
        self.workspaceId = workspaceId
        self.rg = rgName
        self.cluster = clusterName

    def deleteAzureWorkspace(self):
        try:
            mu.updateStatus("workspace", self.workspaceId, "DeletingCluster")
            Azure.deleteAKSCluster(self.rg, self.cluster)
        except Exception as ex:
            mu.updateStatus("workspace", self.workspaceId, "ClusterDeleteFailed")
            raise ex
        try:
            mu.updateStatus("workspace", self.workspaceId, "DeletingRG")
            Azure.deleteResourceGroup(self.rg)
            mu.updateStatus("workspace", self.workspaceId, "Deleted")
        except Exception as ex:
            mu.updateStatus("workspace", self.workspaceId, "RGDeleteFailed")
            raise ex

class OdinUserServiceDeployment:
    def __init__(self, releaseName, env, chartName, values, rg, cluster, userId, workspaceID, serviceId):
        self.values = values
        self.serviceName = releaseName + "-" + env  # 'nginx'
        self.chartName = chartName  # 'bitnami/nginx'
        self.subDomain = self.serviceName
        self.rg = rg
        self.cluster = cluster
        self.deploymentId = str(uuid.uuid4())
        self.userId = userId
        self.workspaceID = workspaceID
        self.serviceId = serviceId
        self.serviceModel : ServiceModel = {
            "_id": self.deploymentId,
            "userId": self.userId,
            "workspaceId": self.workspaceID,
            "values": str(self.values),
            "serviceId": self.serviceId,
            "serviceName": self.serviceName,
            "toBeDeleted": False,
            "exception":""
        }

    def deployAzureUserService(self):
        try:
            Azure.connectToCluster(self.rg, self.cluster)
            Helm.odinHelmSetup()
        except Exception as ex:
            raise ex
        
        loadBalancerIp, url = "", ""
        try:
            self.serviceModel.status = "DeployingService"
            self.serviceModel.endPoint = url
            self.serviceModel.createdAt = int(time.time())
            self.serviceModel.updatedAt = int(time.time())
            self.serviceModel.endPointIp = ""
            mu.save("service", self.serviceModel)
            Helm.deployService(self.serviceName, self.chartName, self.values)
        except Exception as ex:
            mu.updateStatus("service", self.deploymentId, "DeployingServiceFailed")
            raise ex
        try:
            mu.updateStatus("service", self.deploymentId, "CreatingDNSEntry")
            loadBalancerIp, url = Azure.addDNSZoneEntry(self.cluster, self.rg, self.serviceName)
            mu.updateEndPoint("service", self.deploymentId, url)
            mu.updateStatus("service", self.deploymentId, "Completed")
            Utils.pollWebsite(url)
            return url, loadBalancerIp
        except Exception as ex:
            mu.updateStatus("service", self.deploymentId, "CreatingDNSEntryFailed" + str(loadBalancerIp) + str(url))
            raise ex

class OdinUserServiceDelete:
    def __init__(self, rgName, clusterName, serviceName, deploymentId):
        self.rg = rgName
        self.cluster = clusterName
        self.serviceName = serviceName
        self.deploymentId = deploymentId

    def deleteAzureUserService(self):
        try:
            Azure.connectToCluster(self.rg, self.cluster)
            Helm.odinHelmSetup()
        except Exception as ex:
            raise ex
        try:
            mu.updateStatus("service", self.deploymentId, "DeletingService")
            Helm.deleteService(self.serviceName)
        except Exception as ex:
            mu.updateStatus("service", self.deploymentId, "DeletingServiceFailed")
            raise ex
        try:
            mu.updateStatus("service", self.deploymentId, "DNSEntryDelete")
            Azure.deleteDNSZoneEntry(self.cluster, self.rg, self.serviceName)
            mu.updateStatus("service", self.deploymentId, "Deleted")
        except Exception as ex:
            mu.updateStatus("service", self.deploymentId, "DNSEntryDeleteFailed")
            raise ex


class OdinUserServiceUpgrade:
    def __init__(self, rgName, clusterName, serviceName, deploymentId, chartName, values):
        self.rg = rgName
        self.cluster = clusterName
        self.serviceName = serviceName
        self.deploymentId = deploymentId
        self.chartName = chartName
        self.values = values

    def updateAzureUserService(self):
        try:
            Azure.connectToCluster(self.rg, self.cluster)
            Helm.odinHelmSetup()
        except Exception as ex:
            raise ex
        try:
            mu.updateStatus("service", self.deploymentId, "UpdatingService")
            Helm.updateService(self.serviceName,self.chartName, self.values)
            mu.updateValues("service", self.deploymentId, str(self.values))
            mu.updateStatus("service", self.deploymentId, "Completed")
        except Exception as ex:
            mu.updateStatus("service", self.deploymentId, "UpdateFailed")
            raise ex


class OdinWorkspaceHealth:
    def __init__(self, rgName, clusterName):
        self.rg = rgName
        self.cluster = clusterName

    def getAzureWorkspaceHealth(self):
        try:
            Azure.connectToCluster(self.rg, self.cluster)
            return Azure.getWorkspaceHealth(self.rg, self.cluster)
        except Exception as ex:
            raise ex
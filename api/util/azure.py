from util.utilityHelpers import Utils
from util.kubernetes import Kubernentes

class Azure():

    @staticmethod
    def azLogin():
        logincmd = "az login --service-principal --username ff7ddade-ad67-4a39-bd47-70e24d7d3cad --password mPotO1_CyYU0k25BGl9c6uOiVUOUuQFyMC --tenant 279bf323-b273-4703-8951-a88a4fc2a161"
        return Utils.executeCommand(logincmd)

    @staticmethod
    def getSecretFromKeyVault(keyvaultName,secretName):
        azsecret = "az keyvault secret show --vault-name {keyvaultName} --name {secretName}".format(keyvaultName=keyvaultName,secretName=secretName)
        data = Utils.executeCommand(azsecret)
        return str(Utils.getJson(data)["value"])

    @staticmethod
    def createResourceGroup(rg, rgLocation):
        createRG = "az group create --name {rg} --location {rgLocation}".format(rg=rg, rgLocation=rgLocation)
        return Utils.executeCommand(createRG)

    @staticmethod
    def deleteResourceGroup(rg):
        createRG = "az group delete --yes --name {rg}".format(rg=rg)
        return Utils.executeCommand(createRG)
    
    @staticmethod
    def resourceGroupExisit(rg):
        createRG = "az group exists -n {rg}".format(rg=rg)
        return Utils.executeCommand(createRG)

    @staticmethod
    def createAKSCluster(rg, cluster, nodeCount,nodeVmSize):
        createCluster = "az aks create --resource-group {rg} --name {cluster} --node-count {nodeCount} --node-vm-size {nodeVmSize} --generate-ssh-keys --enable-addons http_application_routing".format(
            rg=rg, cluster=cluster, nodeCount=nodeCount, nodeVmSize=nodeVmSize)
        return Utils.executeCommand(createCluster)
    
    @staticmethod
    def deleteAKSCluster(rg, cluster):
        deleteCluster = "az aks delete --yes --resource-group {rg} --name {cluster}".format(
            rg=rg, cluster=cluster)
        return Utils.executeCommand(deleteCluster)

    @staticmethod 
    def connectToCluster(rg, cluster):
        Azure.getClusterCredentials(rg, cluster)
        return Kubernentes.setContext(cluster)

    @staticmethod
    def getClusterCredentials(rg, cluster):
        getCredentials = "az aks get-credentials --resource-group {rg} --name {cluster}".format(rg=rg, cluster=cluster)
        return Utils.executeCommand(getCredentials)

    @staticmethod
    def getAKSClusterInfo(cluster, rg):
        getClusterInfo = "az aks show --name {cluster} --resource-group {rg} -o json".format(rg=rg, cluster=cluster)
        return Utils.executeCommand(getClusterInfo)

    @staticmethod
    def addDNSZoneEntry(cluster, rg, serviceName):
        cluster_info = Azure.getAKSClusterInfo(cluster, rg)
        cluster_info = Utils.getJson(cluster_info)
        dnsZoneRG = cluster_info["nodeResourceGroup"]
        dnsZoneName = cluster_info["addonProfiles"]["httpApplicationRouting"]["config"][
            "HTTPApplicationRoutingZoneName"]
        service_info = Kubernentes.getService(serviceName)
        service_info = Utils.getJson(service_info)
        loadBalancerIp = service_info["status"]["loadBalancer"]["ingress"][0]["ip"]
        createDnsARecord = "az network dns record-set a add-record -g {dnsZoneRG} -z {dnsZoneName} -n {subDomain} -a {loadBalancerIp}".format(
            dnsZoneRG=dnsZoneRG, dnsZoneName=dnsZoneName, subDomain=serviceName, loadBalancerIp=loadBalancerIp)
        url = "http://{subDomain}.{dnsZoneName}".format(subDomain=serviceName, dnsZoneName=dnsZoneName)
        Utils.executeCommand(createDnsARecord)
        return loadBalancerIp, url
    
    @staticmethod
    def deleteDNSZoneEntry(cluster, rg, serviceName):
        cluster_info = Azure.getAKSClusterInfo(cluster, rg)
        cluster_info = Utils.getJson(cluster_info)
        dnsZoneRG = cluster_info["nodeResourceGroup"]
        dnsZoneName = cluster_info["addonProfiles"]["httpApplicationRouting"]["config"][
            "HTTPApplicationRoutingZoneName"]
        deleteARecord = "az network dns record-set a delete --yes -g {dnsZoneRG} -z {dnsZoneName} -n {subDomain}".format(
            dnsZoneRG=dnsZoneRG, dnsZoneName=dnsZoneName, subDomain=serviceName)
        return Utils.executeCommand(deleteARecord)

    @staticmethod
    def getWorkspaceHealth(srg, cluster):
        nodes = Kubernentes.getAllNodes()
        nodes = Utils.getJson(nodes)
        nodeHealthList = []
        for node in nodes["items"]:
            nodeName = node["metadata"]["name"]
            healthResponse = Kubernentes.getNodeHealth(nodeName)
            nodeHealthList.append(str(healthResponse))
        return nodeHealthList
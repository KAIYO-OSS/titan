from util.utilityHelpers import Utils

class Kubernentes():
    
    @staticmethod
    def setContext(clusterName):
        setClusterContext = "kubectl config use-context {cluster}".format(cluster=clusterName)
        return Utils.executeCommand(setClusterContext)
    
    @staticmethod
    def getAllNodes():
        getNodes = "kubectl get nodes -o=json"
        return Utils.executeCommand(getNodes)

    @staticmethod
    def getNodeHealth(nodeName):
        getNodeHealth = "kubectl describe node {nodeName}".format(nodeName=nodeName)
        return Utils.executeCommand(getNodeHealth)

    @staticmethod
    def getAllPods():
        getPods = "kubectl get pods -o json"
        return Utils.executeCommand(getPods)
    
    @staticmethod
    def getPod(podName):
        getPods = "kubectl get pods {podName} -o json".format(podName=podName)
        return Utils.executeCommand(getPods)
    
    @staticmethod
    def getAllServices():
        getServices = "kubectl get services -o json"
        return Utils.executeCommand(getServices)
    
    @staticmethod
    def getService(serviceName):
        getService = "kubectl get services {serviceName} -o json".format(serviceName=serviceName)
        return Utils.executeCommand(getService)

    @staticmethod
    def getPodMetrics(podName):
        metricsCommand = "kubectl top pod {podName}".format(podName=podName)
        return Utils.executeCommand(metricsCommand)
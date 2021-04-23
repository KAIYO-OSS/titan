from util.utilityHelpers import Utils
import time


class Helm():

    @staticmethod
    def addHelmCharts(name, url):
        helmBitnamiUpdate = "helm repo add {name} {url}".format(name=name, url=url)
        return Utils.executeCommand(helmBitnamiUpdate)

    @staticmethod
    def updateRepo():
        helmRepoUpdate = "helm repo update"
        return Utils.executeCommand(helmRepoUpdate)

    @staticmethod
    def odinHelmSetup():
        Helm.addHelmCharts("stable", "https://charts.helm.sh/stable")
        Helm.addHelmCharts("bitnami", "https://charts.bitnami.com/bitnami")
        Helm.addHelmCharts("kaiyo-oss", "https://kaiyo-oss.github.io/Helm-Charts")
        Helm.updateRepo()

    @staticmethod
    def deployService(serviceName, chartName, values):
        helmDeployService = "helm install {serviceName} {chartName} ".format(serviceName=serviceName,
                                                                             chartName=chartName)
        for v in values:
            helmDeployService += " --set "
            helmDeployService += v + "=" + values[v]

        # overriding fullname of service
        helmDeployService += " --set fullnameOverride={serviceName} ".format(serviceName=serviceName)
        out = Utils.executeCommand(helmDeployService)
        time.sleep(10)
        return out

    @staticmethod
    def updateService(serviceName, chartName, values):
        helmUpgradeService = "helm upgrade {serviceName} {chartName} ".format(serviceName=serviceName,
                                                                              chartName=chartName)
        for v in values:
            helmUpgradeService += " --set "
            helmUpgradeService += v + "=" + values[v]

        return Utils.executeCommand(helmUpgradeService)

    @staticmethod
    def deleteService(serviceName):
        helmDeleteService = "helm uninstall {serviceName}".format(serviceName=serviceName)
        return Utils.executeCommand(helmDeleteService)

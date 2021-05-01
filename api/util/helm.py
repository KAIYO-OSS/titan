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
    def deployService(service_name, chart_name, values):
        helmDeployService = "helm install {service_name} {chart_name} ".format(service_name=service_name,
                                                                             chart_name=chart_name)
        for v in values:
            helmDeployService += " --set "
            helmDeployService += v + "=" + values[v]

        # overriding fullname of service
        helmDeployService += " --set fullnameOverride={service_name} ".format(service_name=service_name)
        out = Utils.executeCommand(helmDeployService)
        time.sleep(10)
        return out

    @staticmethod
    def updateService(service_name, chart_name, values):
        helmUpgradeService = "helm upgrade {service_name} {chart_name} ".format(service_name=service_name,
                                                                              chart_name=chart_name)
        for v in values:
            helmUpgradeService += " --set "
            helmUpgradeService += v + "=" + values[v]

        return Utils.executeCommand(helmUpgradeService)

    @staticmethod
    def deleteService(service_name):
        helmDeleteService = "helm uninstall {service_name}".format(service_name=service_name)
        return Utils.executeCommand(helmDeleteService)

    @staticmethod
    def listAllServices():
        list_command = "helm list --all -o json "
        return Utils.executeCommand(list_command)

    @staticmethod
    def getServiceStatus(service_name):
        get_status_command = "helm status {service_name} -o json".format(service_name=service_name)
        return Utils.executeCommand(get_status_command)

    @staticmethod
    def getServiceValues(service_name):
        get_values_command = "helm get values {service_name} -o json".format(service_name=service_name)
        return Utils.executeCommand(get_values_command)
"""
TODO

helm get values -- gives yaml files
helm rollback

"""

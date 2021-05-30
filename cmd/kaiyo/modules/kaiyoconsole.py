import click
from ..utils import configUtil, restClient, consoleUtil, clickUtils

def isValidParam(param):
    if(param == None or param.strip()==""):
        raise Exception("Parameter value is invalid")

@click.option('-p','--profile','profile', default="", required=False, help="Please enter profile name")
@click.option('-w','--workspace','workspace', required=True,prompt=True, help="Please enter workspace name")
@click.command()
def create(profile,workspace):
    """This command used to create workspace."""
    try:
        consoleUtil.setProfile(profile)
        workspace = str(workspace)
        isValidParam(workspace)
        resp = consoleUtil.createWorkspace(workspace)
    except Exception as ex:
        click.echo(ex)

# discuss with dheeraj
@click.option('-p','--profile','profile', default="", required=False, help="Please enter profile name")
@click.option('-r','--repository','repository', required=True,prompt=True, help="Please enter repository url")
@click.command()
def build(profile,repository):
    """This command used to perform build repository."""
    try:
        consoleUtil.setProfile(profile)
        repository = str(repository)
        isValidParam(repository)
    except Exception as ex:
        click.echo(ex)

# discuss with dheeraj
@click.option('-p','--profile','profile', default="", required=False, help="Please enter profile name")
@click.option('-b','--build','build', required=True,prompt=True, help="Please enter build id of your repository")
@click.command()
def deploy(profile,build):
    """This command used to perform deploy service."""
    try:
        consoleUtil.setProfile(profile)
        build = str(build)
        isValidParam(build)
        resp = consoleUtil.deployService(build)
    except Exception as ex:
        click.echo(ex)

# discuss with dheeraj
@click.option('-p','--profile','profile', default="", required=False, help="Please enter profile name")
@click.option('-s','--service','service', required=True,prompt=True, help="Please enter service id")
@click.command()
def update(profile,service):
    """This command used to perform update service."""
    try:
        consoleUtil.setProfile(profile)
        service = str(service)
        isValidParam(service)
        resp = consoleUtil.updateService(service)
    except Exception as ex:
        click.echo(ex)

@click.argument('kaiyotype', nargs=1)
@click.option('-p','--profile','profile', default="", required=False, help="Please enter profile name")
@click.option('-id','--id','id',required=True, prompt=True, help="Please enter id")
@click.command()
def status(kaiyotype,profile,id):
    """This command used to get status of resources."""
    try:
        consoleUtil.setProfile(profile)
        kaiyotype = str(kaiyotype)
        isValidParam(kaiyotype)
        id = str(id)
        isValidParam(id)
        if(kaiyotype=="workspace"):
            resp = consoleUtil.pollWorkspaceStatus(id)
        elif(kaiyotype=="service"):
            resp = consoleUtil.pollServiceStatus(id)
        else:
            raise Exception("Type does not match. Supported types are: [workspace, service]")
    except Exception as ex:
        click.echo(ex)

@click.argument('kaiyotype', nargs=1)
@click.option('-p','--profile','profile', default="", required=False, help="Please enter profile name")
@click.option('-id','--id','id',required=True, prompt=True, help="Please enter id")
@click.command()
def delete(kaiyotype,profile,id):
    """This command used to delete resources."""
    try:
        consoleUtil.setProfile(profile)
        kaiyotype = str(kaiyotype)
        isValidParam(kaiyotype)
        id = str(id)
        isValidParam(id)
        if(kaiyotype=="workspace"):
            resp = consoleUtil.deleteWorkspace(id)
        elif(kaiyotype=="service"):
            resp = consoleUtil.deployService(id)
        else:
            raise Exception("Type does not match. Supported types are: [workspace, service]")
    except Exception as ex:
        click.echo(ex)

@click.argument('kaiyotype', nargs=1)
@click.option('-p','--profile','profile', default="", required=False, help="Please enter profile name")
@click.command()
def show(kaiyotype,profile):
    """This command used to show details for resources."""
    try:
        consoleUtil.setProfile(profile)
        kaiyotype = str(kaiyotype)
        isValidParam(kaiyotype)
        if(kaiyotype=="workspace"):
            id = clickUtils.userinput("Please enter workspace id")
            isValidParam(id)
            resp = consoleUtil.pollWorkspaceStatus(id)
        elif(kaiyotype=="service"):
            id = clickUtils.userinput("Please enter service id")
            isValidParam(id)
            resp = consoleUtil.viewService(id)
        elif(kaiyotype=="bill"):
            resp = consoleUtil.getBillWithUserId()
        else:
            raise Exception("Type does not match. Supported types are: [workspace, service, bill]")
    except Exception as ex:
        click.echo(ex)

@click.argument('kaiyotype', nargs=1)
@click.option('-p','--profile','profile', default="", required=False, help="Please enter profile name")
@click.command()
def list(kaiyotype,profile):
    """This command used to list resource details."""
    try:
        consoleUtil.setProfile(profile)
        kaiyotype = str(kaiyotype)
        isValidParam(kaiyotype)
        if(kaiyotype=="workspaces"):
            resp = consoleUtil.viewAllWorkspaces()
            click.echo(resp)
        elif(kaiyotype=="services"):
            if click.confirm('Do you want to get services accross all workspaces?'):
                resp = consoleUtil.viewAllServices()
            else:
                id = clickUtils.userinput("Please enter workspace id")
                isValidParam(id)
                resp = consoleUtil.viewAllServicesInWorksapces(id)
        elif(kaiyotype=="builds"):
            id = clickUtils.userinput("Please enter repository id")
            isValidParam(id)
            # discuss with dheeraj
            # resp = consoleUtil.viewAllWorkspaces()
        else:
            raise Exception("Type does not match. Supported types are: [builds, workspaces, services]")
    except Exception as ex:
        click.echo(ex)

@click.option('-p','--profile','profile', default="", required=False, help="Please enter profile name")
@click.option('-s','--service','service', required=True,prompt=True, help="Please enter service id")
@click.command()
def logs(profile,service):
    """This command used get logs for service."""
    try:
        consoleUtil.setProfile(profile)
        service = str(service)
        isValidParam(service)
        consoleUtil.getLogs(service)
    except Exception as ex:
        click.echo(ex)
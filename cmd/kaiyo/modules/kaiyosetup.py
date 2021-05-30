import click
from ..utils import configUtil, restClient, helpers, consoleUtil,clickUtils

@click.command()
def configure():
    """This kaiyo configure command used to change kaiyoconfig.json file which holds all authentication related information."""
    try:
        click.echo("Working, configure")
        c1 = 'View all kaiyo configurations'
        c2 = 'Get default configurations'
        c3 = 'Change default profile'
        c4 = 'Delete profile'
        cmd = clickUtils.userListInput([c1,c2,c3,c4])
        profilearr: list = configUtil.getProfiles()
        profileNames = []
        for p in profilearr:
            profileNames.append(p["profilename"])
        if(cmd == c1):
            click.echo(profileNames)
        elif(cmd == c2):
            profile = configUtil.getDefaultProfile()
            click.echo(profile)
        elif(cmd == c3):
            if(len(profileNames)<2):
                click.echo(profileNames)
                click.echo("Only single profile is there. Please do kaiyo login first.")
            else:
                profileName = clickUtils.userListInput(profileNames,"Please select default profile name")
                msg = 'Do you want to continue to change default profile to {profileName}?'.format(profileName=profileName)
                if click.confirm(msg):
                    configUtil.changeDefaultProfile(profileName)
                    click.echo('Default profile changed.')
                else:
                    click.echo('Default profile not changed.')
        elif(cmd == c4):
            profileName = clickUtils.userListInput(profileNames,"Please select profile")
            msg = 'Do you want to continue to delete {profileName} porfile?'.format(profileName=profileName)
            if click.confirm(msg):
                configUtil.deleteProfile(profileName)
                click.echo('Default profile changed.')
            else:
                click.echo('Default profile not changed.')
            click.echo("Working, Delete")
    except Exception as ex:
        click.echo(ex)

@click.command()
def signup():
    """This kaiyo login command used to signup to your kaiyo account."""
    try:
        userid = consoleUtil.signup()
    except Exception as ex:
        click.echo(ex)

@click.command()
@click.option("-e","--email","email", prompt=True, help="Enter email of your kaiyo account")
@click.option("-p","--password","password", prompt=True, hide_input=True,
            confirmation_prompt=True, help="Enter password of your kaiyo account")
def login(email,password):
    """This kaiyo login command used to login to your kaiyo account."""
    try:
        # password = helpers.Utils.encrypt(password)
        # userid, token = resp = consoleUtil.login(email,password)
        userid, token = consoleUtil.login("mayank9722@xyz.in","password")
        profilename = str(userid)+"profile"
        data = {
                "profilename": profilename,
                "info" : {
                    "name": str(userid),
                    "extra":{}
                },
                "token":str(token)
        }
        configUtil.updateOrAddNewProfile(data,profilename)
    except Exception as ex:
        click.echo(ex)

@click.command()
def logout():
    """This kaiyo logout command used to logout from your kaiyo account."""
    try:
        consoleUtil.logout()
        configUtil.deleteProfile(None)
    except Exception as ex:
        click.echo(ex)
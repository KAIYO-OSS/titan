import click
import inquirer

def userinput(msg: str):
    value = click.prompt(msg, type=str)
    value = value.replace(" ", "")
    return str(value)

def userListInput(choices: list,msg=None):
    if(msg==None):
        msg = "Please select action to perform"
    cmd = [
        inquirer.List('cmd',
        message = msg,
        choices = choices,
        )
    ]
    cmd = inquirer.prompt(cmd)['cmd']
    return cmd

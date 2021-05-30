import click
import pyfiglet
import inquirer
import locale
from .modules import kaiyosetup, kaiyoconsole

locale.setlocale(locale.LC_ALL, str('en_US.UTF-8'))

@click.group()
def kaiyo():
    pass

print(pyfiglet.figlet_format("Kaiyo", font = "standard"))
kaiyo.add_command(kaiyosetup.signup)
kaiyo.add_command(kaiyosetup.login)
kaiyo.add_command(kaiyosetup.configure)
kaiyo.add_command(kaiyosetup.logout)

kaiyo.add_command(kaiyoconsole.create)
kaiyo.add_command(kaiyoconsole.build)
kaiyo.add_command(kaiyoconsole.deploy)
kaiyo.add_command(kaiyoconsole.update)
kaiyo.add_command(kaiyoconsole.status)
kaiyo.add_command(kaiyoconsole.delete)
kaiyo.add_command(kaiyoconsole.show)
kaiyo.add_command(kaiyoconsole.list)
kaiyo.add_command(kaiyoconsole.logs)
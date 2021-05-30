### Welcome to Commander click

## To generate build and dest files
python3 setup.py sdist bdist_wheel   

## To use on local
pip3 install -e .                                                           

## Commands
```
1 kaiyo login
2 kaiyo create --workspace=“”
3 kaiyo build --servicename ="bifrost" --repository = “”

xyz-bifrost
userdid-servicename

kaiyo list builds -servicename=""


4 kaiyo deploy --servicename="" --values="file.json" --version="" --worskpace=""

kaiyo logout

kaiyo update -—service=“”

kaiyo status --workspace= “”
kaiyo status --service=“”

kaiyo delete --service=“”
kaiyo delete --workspace=“”

kaiyo show --workspace=“”
kaiyo show --service=“”
kaiyo show bill 

kaiyo list builds --repository = “”
kaiyo list workspaces
kaiyo list services
kaiyo list services —worksapce = “”

kaiyo logs --service=“”
```
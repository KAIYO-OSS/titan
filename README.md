# Titan

## Description

Titan is an open source CI/CD tool built with cloud native tools. It supports service deployments, secret management, resource access management, canary deployment, etc. It currently supports deployments to any kubernetes cluster as long as it an access it resources. It is built around making devs faster at deploying services to kubernetes using helm charts. 

## Dependencies 

- Etcd 3
- Python 3 
- Nodejs >= 14
- Docker deskop 
- minikube or kubernetes


## Installation 

Currently supports MacOS and Linux Installations only 
run respective docker instances and a ```etcd``` client. 

## TODO

- [x] deployment for helm charts 
- [x] rollbacks 
- [x] service details  
- [ ] access control list and SSO 
- [ ] deployment approval and rejection 
- [ ] cluster switching 

## Contribution 

Please follow [CONTRIB.md](https://github.com/KAIYO-OSS/titan/blob/master/CONTRIBUTION.md) for contribution guidelines 

## Security 

Please follow [SECURITY.md](https://github.com/KAIYO-OSS/titan/blob/master/SECURITY.md) for security guidelines 

## Conduct 

Please follow [CONDUCT.md](https://github.com/KAIYO-OSS/titan/blob/master/CONDUCT.md) for conduct guidelines 

## Open source licensing info

Read LICENSE and TERMS

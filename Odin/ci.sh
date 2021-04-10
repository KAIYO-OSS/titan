#!/usr/bin/env bash

if [[ $1 == "ci" ]]
then
  echo "log in to acr"
  docker login -u kaiyo-kubernetes -p SpHmOxc+dQZQXt62YLJV98FjHyiFZnAv
  echo "building docker image"
  docker build -t odin-kaiyo-service .
  echo "tagging docker image"
  docker tag odin-kaiyo-service kaiyocloud.azurecr.io/odin-kaiyo-service:"$2"
  echo "pushing docker image to acr"
  docker push kaiyocloud.azurecr.io/odin-kaiyo-service:"$2"
  echo "pushed image with tag - $2"

elif [[ $1 == "cd" ]];
then
  echo "doing cd with $1 $2 $3"
  az account set --subscription 9e4608a6-6d91-473e-9d62-f76f36d4ed02
  az aks get-credentials --resource-group kaiyo-prod --name kaiyo
  echo "upgrading or installing helm service $2 $3"
  helm upgrade --install "$2" https://kaiyo-oss.github.io/Helm-Charts/servicechart-1.1.0.tgz -f "$3"
  echo "deployed"
fi



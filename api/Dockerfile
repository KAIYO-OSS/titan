FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

EXPOSE 5000

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
RUN aws --version

RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash
RUN az version

COPY . /app

WORKDIR /app

RUN pip install -r requirements.txt
RUN curl -fsSL -o get_helm.sh "https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3"
RUN chmod 700 get_helm.sh
RUN ./get_helm.sh
RUN curl -L -s "https://dl.k8s.io/release/stable.txt"
RUN curl -LO "https://storage.googleapis.com/kubernetes-release/release/v1.23.1/bin/linux/amd64/kubectl"
RUN chmod +x kubectl



# CMD ["uvicorn" ,"application:application", "--host", "0.0.0.0", "--port" ,"5000"]
CMD [ "python", "application.py" ]

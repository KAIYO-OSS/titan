FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

EXPOSE 5000

COPY . /app

WORKDIR /app

RUN pip install -r requirements.txt

RUN curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3

RUN chmod 700 get_helm.sh

RUN ./get_helm.sh

CMD ["uvicorn" ,"application:application", "--host", "0.0.0.0", "--port" ,"5000"]

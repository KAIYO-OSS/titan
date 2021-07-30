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

CMD ["uvicorn" ,"application:application", "--host", "0.0.0.0", "--port" ,"5000"]
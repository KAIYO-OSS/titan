FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

EXPOSE 5000

COPY . /app

WORKDIR /app

RUN pip install -r requirements.txt

RUN pip install websockets

CMD ["uvicorn" ,"application:application", "--host", "0.0.0.0", "--port" ,"5000"]
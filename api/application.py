import uvicorn
from fastapi import FastAPI
from starlette_exporter import PrometheusMiddleware, handle_metrics


from routers import  odin, details, polling

application = FastAPI()
application.include_router(odin.router)
application.include_router(details.router)
application.include_router(polling.router)

application.add_middleware(PrometheusMiddleware, group_paths=True, buckets=[0.1, 0.25, 0.5, 0.9, 0.95, 0.995])
application.add_route("/metrics", handle_metrics)


@application.get("/health")
async def root():
    return {"status": "true"}


if __name__ == "__main__":
    # ServiceBusUtil.azureLogin()
    # ServiceBusUtil.createAllQueues()
    # ServiceBusUtil.listenToQueues(ServiceBusUtil.allQueues)
    try:
        uvicorn.run(
            "application:application",
            port=5000,
            host="0.0.0.0"
        )
    except Exception as ex:
        print("Exception in application: " + str(ex))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.simulation import router as simulation_router
from app.api.routes.result import router as result_router
from app.api.routes.topology import router as topology_router
from app.api.routes.fault_injection import router as fault_injection_router
from app.api.routes.report import router as report_router

app = FastAPI(title="RetryScope")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulation_router)
app.include_router(result_router)
app.include_router(topology_router)
app.include_router(fault_injection_router)
app.include_router(report_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
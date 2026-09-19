from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.engines.fault_injection.instance import (
    fault_injection_engine
)


router = APIRouter(
    prefix="/fault-injection",
    tags=["Fault Injection"]
)


class FaultInjectionRequest(BaseModel):

    service: str

    fault_type: str

    duration: float

    timeout_ms: float | None = None

    latency_ms: float | None = None

    error_percentage: float | None = None


@router.post("/inject")
def inject_fault(
    request: FaultInjectionRequest
):

    try:

        fault = fault_injection_engine.add_fault(

            service=request.service,

            fault_type=request.fault_type,

            duration=request.duration,

            timeout_ms=request.timeout_ms,

            latency_ms=request.latency_ms,

            error_percentage=request.error_percentage
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    return {

        "success": True,

        "fault": fault
    }


@router.get("/faults")
def get_faults():

    return {

        "faults":
            fault_injection_engine.get_faults()

    }


@router.delete("/faults")
def clear_faults():

    fault_injection_engine.clear_faults()

    return {

        "success": True,

        "message": "All faults cleared"

    }
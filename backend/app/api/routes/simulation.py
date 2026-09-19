from fastapi import APIRouter, HTTPException

from app.schemas.simulation import SimulationRequest

from app.engines.simulation.engine import SimulationEngine

from app.engines.risk.engine import RiskEngine

from app.engines.recommendation.engine import (
    RecommendationEngine
)

from app.engines.fault_injection.instance import (
    fault_injection_engine
)

from app.engines.topology.instance import (
    topology_engine
)

from app.database.simulation_repository import (
    save_simulation_result
)

from app.database.risk_repository import (
    save_risk_result
)

from app.database.recommendation_repository import (
    save_recommendation
)


router = APIRouter(
    prefix="/simulation",
    tags=["Simulation"]
)


@router.post("/run")
def run_simulation(
    request: SimulationRequest
):

    # ==========================================
    # 1. Create simulation engine
    # ==========================================

    simulation_engine = SimulationEngine(
        fault_engine=fault_injection_engine,
        topology_engine=topology_engine
    )


    # ==========================================
    #   Validate topology before simulation
    # ==========================================

    available_services = topology_engine.get_services()

    matched_service = next(
        (
            service
            for service in available_services
            if service.lower() == request.service_name.lower()
        ),
        None
    )

    if matched_service is None:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Service '{request.service_name}' does not exist "
                "in the current topology. Save the topology first."
            )
        )

    # Use the actual topology service name
    service_name = matched_service



    # ==========================================
    # 2. Run simulation
    # ==========================================

    simulation_result = simulation_engine.run(

        number_of_users=request.number_of_users,

        service_name=service_name,

        requests_per_user=request.requests_per_user,

        duration=request.duration,

        failure_rate=request.failure_rate,
        
        random_seed=request.random_seed,

        max_retries=request.max_retries,

        backoff=request.backoff,

        base_retry_delay=request.base_retry_delay,

        backoff_multiplier=request.backoff_multiplier,

        jitter=request.jitter,

        timeout=request.timeout,
        
    )

    # ==========================================
    # 3. Save simulation
    # ==========================================

    simulation_id = save_simulation_result(
        simulation_result
    )

    # ==========================================
    # 4. Risk
    # ==========================================

    risk_engine = RiskEngine()

    risk_result = risk_engine.assess(
        simulation_result
    )

    # ==========================================
    # 5. Save risk
    # ==========================================

    risk_id = save_risk_result(
        simulation_id,
        risk_result
    )

    # ==========================================
    # 6. Recommendation
    # ==========================================

    recommendation_engine = (
        RecommendationEngine()
    )

    recommendation_result = (
        recommendation_engine.recommend(
            risk_result
        )
    )

    # ==========================================
    # 7. Save recommendation
    # ==========================================

    recommendation_id = save_recommendation(
        risk_id,
        recommendation_result
    )

    # ==========================================
    # 8. Add IDs
    # ==========================================

    simulation_result["simulation_id"] = (
        simulation_id
    )

    risk_result["risk_id"] = risk_id

    risk_result["simulation_id"] = (
        simulation_id
    )

    recommendation_result[
        "recommendation_id"
    ] = recommendation_id

    recommendation_result[
        "risk_result_id"
    ] = risk_id

    # ==========================================
    # 9. Return
    # ==========================================

    return {

        "simulation": simulation_result,

        "risk": risk_result,

        "recommendation":
            recommendation_result

    }
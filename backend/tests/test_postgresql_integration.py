from app.database.simulation_repository import (
    save_simulation_result,
    get_simulation_result
)

from app.database.risk_repository import (
    save_risk_result,
    get_risk_result
)

from app.database.recommendation_repository import (
    save_recommendation,
    get_recommendation
)


def test_full_postgresql_integration():

    # ==========================================
    # 1. Simulation result
    # ==========================================

    simulation_result = {
        "users": 10,
        "service": "inventory",
        "total_requests": 15,
        "failed_requests": 5,
        "successful_requests": 10,
        "successful_users": 8,
        "failed_users": 2,
        "total_retries": 5,
        "retry_amplification_factor": 1.5,
        "failure_rate": 0.3333,
        "success_rate": 0.8,
        "average_retries": 0.5,
        "average_duration": 6.5,
        "max_retries":3,
        "max_retries_used": 2,
        "configured_failure_rate": 0,
        "timeout": 1000,
        "backoff": "exponential",
    }

    # Save simulation
    simulation_id = save_simulation_result(
        simulation_result
    )

    assert simulation_id is not None

    # Read simulation back
    stored_simulation = get_simulation_result(
        simulation_id
    )

    assert stored_simulation is not None
    assert stored_simulation["users"] == 10
    assert stored_simulation["service"] == "inventory"
    assert stored_simulation["total_requests"] == 15
    assert stored_simulation["total_retries"] == 5


    # ==========================================
    # 2. Risk result
    # ==========================================

    risk_result = {
        "retry_risk": 25,
        "failure_risk": 50,
        "cascade_risk": 25,
        "overall_score": 32.5,
        "risk_level": "MEDIUM",
        "risk_explanation": (
            "Test integration risk result"
        )
    }

    # Save risk
    risk_id = save_risk_result(
        simulation_id,
        risk_result
    )

    assert risk_id is not None

    # Read risk back
    stored_risk = get_risk_result(
        risk_id
    )

    assert stored_risk is not None
    assert stored_risk["simulation_id"] == simulation_id
    assert stored_risk["retry_risk"] == 25
    assert stored_risk["failure_risk"] == 50
    assert stored_risk["risk_level"] == "MEDIUM"


    # ==========================================
    # 3. Recommendation
    # ==========================================

    recommendation_result = {
        "risk_level": "MEDIUM",
        "overall_score": 32.5,

        "retry": {
            "recommendation": "Keep retries low.",
            "recommended_max_retries": 2
        },

        "backoff": {
            "recommendation": "Use exponential backoff.",
            "recommended_backoff_multiplier": 2
        },

        "jitter": {
            "recommendation": "Consider enabling jitter.",
            "recommended_jitter": True
        },

        "failure_handling": {
            "recommendation": "Monitor service failures.",
            "recommended_circuit_breaker": False,
            "recommended_dependency_isolation": False
        }
    }

    # Save recommendation
    recommendation_id = save_recommendation(
        risk_id,
        recommendation_result
    )

    assert recommendation_id is not None

    # Read recommendation back
    stored_recommendation = get_recommendation(
        recommendation_id
    )

    assert stored_recommendation is not None
    assert (
        stored_recommendation["risk_result_id"]
        == risk_id
    )
    assert (
        stored_recommendation["risk_level"]
        == "MEDIUM"
    )
    assert (
        stored_recommendation["overall_score"]
        == 32.5
    )
    assert (
        stored_recommendation[
            "recommended_max_retries"
        ]
        == 2
    )
    assert (
        stored_recommendation[
            "recommended_backoff_multiplier"
        ]
        == 2
    )
    assert (
        stored_recommendation[
            "recommended_jitter"
        ]
        is True
    )
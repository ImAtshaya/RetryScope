from app.database.simulation_repository import (
    save_simulation_result,
    get_simulation_result
)


def test_save_simulation_result():

    simulation_result = {
        "users": 5,
        "service": "inventory",
        "total_requests": 7,
        "failed_requests": 2,
        "successful_requests": 5,
        "successful_users": 4,
        "failed_users": 1,
        "total_retries": 2,
        "retry_amplification_factor": 1.4,
        "failure_rate": 0.2857,
        "success_rate": 0.8,
        "average_retries": 0.4,
        "average_duration": 5.2,
        "max_retries":3,
        "max_retries_used": 2,
        "configured_failure_rate": 0,
        "timeout": 1000,
        "backoff": "exponential",
    }

    simulation_id = save_simulation_result(
        simulation_result
    )

    assert simulation_id is not None


def test_get_simulation_result():

    simulation_result = {
        "users": 5,
        "service": "inventory",
        "total_requests": 7,
        "failed_requests": 2,
        "successful_requests": 5,
        "successful_users": 4,
        "failed_users": 1,
        "total_retries": 2,
        "retry_amplification_factor": 1.4,
        "failure_rate": 0.2857,
        "success_rate": 0.8,
        "average_retries": 0.4,
        "average_duration": 5.2,
        "max_retries":3,
        "max_retries_used": 2,
        "configured_failure_rate": 0,
        "timeout": 1000,
        "backoff": "exponential",
    }

    simulation_id = save_simulation_result(
        simulation_result
    )

    result = get_simulation_result(simulation_id)

    assert result is not None
    assert result["id"] == simulation_id
    assert result["users"] == 5
    assert result["service"] == "inventory"
    assert result["total_requests"] == 7
    assert result["total_retries"] == 2
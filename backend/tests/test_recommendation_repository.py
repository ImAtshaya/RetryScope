from app.database.recommendation_repository import (
    save_recommendation,
    get_recommendation
)


def test_save_recommendation():

    recommendation_result = {
        "risk_level": "MEDIUM",
        "overall_score": 35.0,

        "retry": {
            "recommendation": "Reduce the number of retries.",
            "recommended_max_retries": 2
        },

        "backoff": {
            "recommendation": "Use exponential backoff.",
            "recommended_backoff_multiplier": 2
        },

        "jitter": {
            "recommendation": "Consider enabling jitter to spread retries.",
            "recommended_jitter": True
        },

        "failure_handling": {
            "recommendation": "Improve failure handling and monitor service failure rates.",
            "recommended_circuit_breaker": False,
            "recommended_dependency_isolation": False
        }
    }

    recommendation_id = save_recommendation(
        risk_result_id=1,
        recommendation_result=recommendation_result
    )

    assert recommendation_id is not None


def test_get_recommendation():

    recommendation_result = {
        "risk_level": "MEDIUM",
        "overall_score": 35.0,

        "retry": {
            "recommendation": "Reduce the number of retries.",
            "recommended_max_retries": 2
        },

        "backoff": {
            "recommendation": "Use exponential backoff.",
            "recommended_backoff_multiplier": 2
        },

        "jitter": {
            "recommendation": "Consider enabling jitter to spread retries.",
            "recommended_jitter": True
        },

        "failure_handling": {
            "recommendation": "Improve failure handling and monitor service failure rates.",
            "recommended_circuit_breaker": False,
            "recommended_dependency_isolation": False
        }
    }

    recommendation_id = save_recommendation(
        risk_result_id=1,
        recommendation_result=recommendation_result
    )

    result = get_recommendation(recommendation_id)

    assert result is not None
    assert result["id"] == recommendation_id
    assert result["risk_result_id"] == 1
    assert result["risk_level"] == "MEDIUM"
    assert result["overall_score"] == 35.0
    assert result["recommended_max_retries"] == 2
    assert result["recommended_backoff_multiplier"] == 2
    assert result["recommended_jitter"] is True
    assert result["recommended_circuit_breaker"] is False
    assert result["recommended_dependency_isolation"] is False
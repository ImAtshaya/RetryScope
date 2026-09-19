from app.database.risk_repository import (
    save_risk_result,
    get_risk_result
)


def test_save_risk_result():

    risk_result = {
        "retry_risk": 50,
        "failure_risk": 25,
        "cascade_risk": 25,
        "overall_score": 35.0,
        "risk_level": "MEDIUM",
        "risk_explanation": "Test risk result"
    }

    risk_id = save_risk_result(
        simulation_id=1,
        risk_result=risk_result
    )

    assert risk_id is not None


def test_get_risk_result():

    risk_result = {
        "retry_risk": 50,
        "failure_risk": 25,
        "cascade_risk": 25,
        "overall_score": 35.0,
        "risk_level": "MEDIUM",
        "risk_explanation": "Test risk result"
    }

    risk_id = save_risk_result(
        simulation_id=1,
        risk_result=risk_result
    )

    result = get_risk_result(risk_id)

    assert result is not None
    assert result["id"] == risk_id
    assert result["simulation_id"] == 1
    assert result["retry_risk"] == 50
    assert result["failure_risk"] == 25
    assert result["cascade_risk"] == 25
    assert result["overall_score"] == 35.0
    assert result["risk_level"] == "MEDIUM"
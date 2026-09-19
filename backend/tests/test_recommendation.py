from app.engines.recommendation.engine import RecommendationEngine


def test_no_retry_recommendation():

    engine = RecommendationEngine()

    result = engine.recommend_retry_configuration(0)

    assert result["recommended_max_retries"] is None
    assert result["recommendation"] == "No retry changes required."


def test_low_retry_risk():

    engine = RecommendationEngine()

    result = engine.recommend_retry_configuration(25)

    assert result["recommended_max_retries"] == 2


def test_medium_retry_risk():

    engine = RecommendationEngine()

    result = engine.recommend_retry_configuration(50)

    assert result["recommended_max_retries"] == 2


def test_high_retry_risk():

    engine = RecommendationEngine()

    result = engine.recommend_retry_configuration(75)

    assert result["recommended_max_retries"] == 1


def test_critical_retry_risk():

    engine = RecommendationEngine()

    result = engine.recommend_retry_configuration(100)

    assert result["recommended_max_retries"] == 1
    
def test_no_backoff_recommendation():

    engine = RecommendationEngine()

    result = engine.recommend_backoff_configuration(0)

    assert result["recommended_backoff_multiplier"] == 1
    assert result["recommendation"] == "No backoff changes required."


def test_low_backoff_risk():

    engine = RecommendationEngine()

    result = engine.recommend_backoff_configuration(25)

    assert result["recommended_backoff_multiplier"] == 1.5


def test_medium_backoff_risk():

    engine = RecommendationEngine()

    result = engine.recommend_backoff_configuration(50)

    assert result["recommended_backoff_multiplier"] == 2


def test_high_backoff_risk():

    engine = RecommendationEngine()

    result = engine.recommend_backoff_configuration(75)

    assert result["recommended_backoff_multiplier"] == 2


def test_critical_backoff_risk():

    engine = RecommendationEngine()

    result = engine.recommend_backoff_configuration(100)

    assert result["recommended_backoff_multiplier"] == 3
    
    
def test_no_jitter_recommendation():

    engine = RecommendationEngine()

    result = engine.recommend_jitter_configuration(0)

    assert result["recommended_jitter"] is False


def test_low_jitter_risk():

    engine = RecommendationEngine()

    result = engine.recommend_jitter_configuration(25)

    assert result["recommended_jitter"] is False


def test_medium_jitter_risk():

    engine = RecommendationEngine()

    result = engine.recommend_jitter_configuration(50)

    assert result["recommended_jitter"] is True


def test_high_jitter_risk():

    engine = RecommendationEngine()

    result = engine.recommend_jitter_configuration(75)

    assert result["recommended_jitter"] is True


def test_critical_jitter_risk():

    engine = RecommendationEngine()

    result = engine.recommend_jitter_configuration(100)

    assert result["recommended_jitter"] is True
    
def test_no_failure_or_cascade_risk():

    engine = RecommendationEngine()

    result = engine.recommend_failure_configuration(
        failure_risk=0,
        cascade_risk=0
    )

    assert result["recommended_circuit_breaker"] is False
    assert result["recommended_dependency_isolation"] is False


def test_high_failure_risk():

    engine = RecommendationEngine()

    result = engine.recommend_failure_configuration(
        failure_risk=75,
        cascade_risk=0
    )

    assert result["recommended_circuit_breaker"] is True
    assert result["recommended_dependency_isolation"] is False


def test_medium_failure_risk():

    engine = RecommendationEngine()

    result = engine.recommend_failure_configuration(
        failure_risk=50,
        cascade_risk=0
    )

    assert result["recommended_circuit_breaker"] is False
    assert result["recommended_dependency_isolation"] is False


def test_high_cascade_risk():

    engine = RecommendationEngine()

    result = engine.recommend_failure_configuration(
        failure_risk=0,
        cascade_risk=75
    )

    assert result["recommended_circuit_breaker"] is True
    assert result["recommended_dependency_isolation"] is True


def test_medium_cascade_risk():

    engine = RecommendationEngine()

    result = engine.recommend_failure_configuration(
        failure_risk=0,
        cascade_risk=50
    )

    assert result["recommended_circuit_breaker"] is False
    assert result["recommended_dependency_isolation"] is True
    
    
def test_complete_low_risk_recommendation():

    engine = RecommendationEngine()

    risk_result = {
        "retry_risk": 0,
        "failure_risk": 0,
        "cascade_risk": 0,
        "overall_score": 0,
        "risk_level": "LOW"
    }

    result = engine.recommend(risk_result)

    assert result["risk_level"] == "LOW"
    assert result["overall_score"] == 0

    assert "retry" in result
    assert "backoff" in result
    assert "jitter" in result
    assert "failure_handling" in result


def test_complete_high_risk_recommendation():

    engine = RecommendationEngine()

    risk_result = {
        "retry_risk": 75,
        "failure_risk": 100,
        "cascade_risk": 75,
        "overall_score": 85,
        "risk_level": "HIGH"
    }

    result = engine.recommend(risk_result)

    assert result["risk_level"] == "HIGH"
    assert result["overall_score"] == 85

    assert result["jitter"]["recommended_jitter"] is True

    assert (
        result["failure_handling"]
        ["recommended_circuit_breaker"]
        is True
    )

    assert (
        result["failure_handling"]
        ["recommended_dependency_isolation"]
        is True
    )


def test_complete_medium_risk_recommendation():

    engine = RecommendationEngine()

    risk_result = {
        "retry_risk": 50,
        "failure_risk": 50,
        "cascade_risk": 50,
        "overall_score": 50,
        "risk_level": "MEDIUM"
    }

    result = engine.recommend(risk_result)

    assert result["risk_level"] == "MEDIUM"
    assert result["overall_score"] == 50

    assert result["jitter"]["recommended_jitter"] is True

    assert (
        result["failure_handling"]
        ["recommended_dependency_isolation"]
        is True
    )
    
def test_retry_recommendation_boundary_values():

    engine = RecommendationEngine()

    result = engine.recommend_retry_configuration(25)

    assert result["recommended_max_retries"] == 2


def test_backoff_recommendation_boundary_values():

    engine = RecommendationEngine()

    result = engine.recommend_backoff_configuration(50)

    assert result["recommended_backoff_multiplier"] == 2


def test_jitter_recommendation_boundary_values():

    engine = RecommendationEngine()

    result = engine.recommend_jitter_configuration(50)

    assert result["recommended_jitter"] is True


def test_failure_configuration_boundary_values():

    engine = RecommendationEngine()

    result = engine.recommend_failure_configuration(
        failure_risk=75,
        cascade_risk=50
    )

    assert result["recommended_circuit_breaker"] is True
    assert result["recommended_dependency_isolation"] is True


def test_complete_recommendation_missing_values():

    engine = RecommendationEngine()

    result = engine.recommend({})

    assert result["risk_level"] == "LOW"
    assert result["overall_score"] == 0

    assert "retry" in result
    assert "backoff" in result
    assert "jitter" in result
    assert "failure_handling" in result
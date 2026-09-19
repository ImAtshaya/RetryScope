from app.engines.risk.engine import RiskEngine


def test_retry_risk():

    engine = RiskEngine()

    assert engine.calculate_retry_risk(1) == 0
    assert engine.calculate_retry_risk(2) == 25
    assert engine.calculate_retry_risk(5) == 50
    assert engine.calculate_retry_risk(10) == 75
    assert engine.calculate_retry_risk(20) == 100


def test_failure_risk():

    engine = RiskEngine()

    assert engine.calculate_failure_risk(0) == 0
    assert engine.calculate_failure_risk(0.10) == 25
    assert engine.calculate_failure_risk(0.30) == 50
    assert engine.calculate_failure_risk(0.50) == 75
    assert engine.calculate_failure_risk(0.80) == 100


def test_cascade_risk():

    engine = RiskEngine()

    assert engine.calculate_cascade_risk(0) == 0
    assert engine.calculate_cascade_risk(2) == 25
    assert engine.calculate_cascade_risk(5) == 50
    assert engine.calculate_cascade_risk(10) == 75
    assert engine.calculate_cascade_risk(20) == 100


def test_overall_score():

    engine = RiskEngine()

    score = engine.calculate_overall_score(
        retry_risk=50,
        failure_risk=50,
        cascade_risk=50
    )

    assert score == 50


def test_low_risk():

    engine = RiskEngine()

    assert engine.classify_risk(10) == "LOW"


def test_medium_risk():

    engine = RiskEngine()

    assert engine.classify_risk(50) == "MEDIUM"


def test_high_risk():

    engine = RiskEngine()

    assert engine.classify_risk(80) == "HIGH"

    
def test_assess_simulation_result():

    engine = RiskEngine()

    simulation_result = {
        "retry_amplification_factor": 5,
        "failure_rate": 0.30,
        "cascade_events": [
            {"failed_service": "database", "affected_service": "payment"},
            {"failed_service": "database", "affected_service": "gateway"},
            {"failed_service": "payment", "affected_service": "gateway"}
        ]
    }

    result = engine.assess(simulation_result)

    assert result["retry_risk"] == 50
    assert result["failure_risk"] == 50
    assert result["cascade_risk"] == 50
    assert result["overall_score"] == 50
    assert result["risk_level"] == "MEDIUM"
    
def test_assess_with_real_simulation_output():

    from app.engines.topology.engine import TopologyEngine
    from app.engines.fault_injection.engine import FaultInjectionEngine
    from app.engines.simulation.engine import SimulationEngine

    # Create topology
    topology = TopologyEngine()

    topology.add_service("gateway")
    topology.add_service("payment")
    topology.add_service("database")

    topology.add_dependency(
        "gateway",
        "payment"
    )

    topology.add_dependency(
        "payment",
        "database"
    )

    # Create fault
    fault_engine = FaultInjectionEngine()

    fault_engine.add_fault(
        "database",
        "failure",
        10
    )

    # Create simulation engine
    simulation_engine = SimulationEngine(
        fault_engine=fault_engine,
        topology_engine=topology
    )

    # Run real simulation
    simulation_result = simulation_engine.run(
        number_of_users=1,
        service_name="gateway",
        max_retries=2,
        base_retry_delay=1,
        backoff_multiplier=2,
        jitter=False
    )

    # Create risk engine
    risk_engine = RiskEngine()

    # Assess REAL simulation output
    result = risk_engine.assess(
        simulation_result
    )

    # Verify risk assessment
    assert "retry_risk" in result
    assert "failure_risk" in result
    assert "cascade_risk" in result
    assert "overall_score" in result
    assert "risk_level" in result

    # Database failure should create
    # at least one cascade event.
    assert len(
        simulation_result["cascade_events"]
    ) > 0

    assert result["cascade_risk"] > 0
    
    
def test_classify_risk():

    engine = RiskEngine()

    assert engine.classify_risk(0) == "LOW"
    assert engine.classify_risk(29) == "LOW"

    assert engine.classify_risk(30) == "MEDIUM"
    assert engine.classify_risk(69) == "MEDIUM"

    assert engine.classify_risk(70) == "HIGH"
    assert engine.classify_risk(100) == "HIGH"
    
def test_explain_risk():

    engine = RiskEngine()

    explanation = engine.explain_risk(
        retry_risk=50,
        failure_risk=75,
        cascade_risk=50
    )

    assert "Retry amplification" in explanation
    assert "Request failures" in explanation
    assert "Cascading failures" in explanation
    
    
def test_explain_no_risk():

    engine = RiskEngine()

    explanation = engine.explain_risk(
        retry_risk=0,
        failure_risk=0,
        cascade_risk=0
    )

    assert explanation == (
        "No significant risk factors detected."
    )
    
    
def test_full_risk_engine():

    from app.engines.risk.engine import RiskEngine

    engine = RiskEngine()

    simulation_result = {
        "retry_amplification_factor": 7.0,
        "failure_rate": 0.5714,
        "cascade_events": [
            {
                "user_id": 1,
                "failed_service": "database",
                "affected_service": "payment"
            }
        ]
    }

    result = engine.assess(simulation_result)

    # Risk components
    assert result["retry_risk"] == 75
    assert result["failure_risk"] == 100
    assert result["cascade_risk"] == 25

    # Overall score
    expected_score = (
        75 * 0.40
        + 100 * 0.30
        + 25 * 0.30
    )

    assert result["overall_score"] == round(
        expected_score,
        2
    )

    # Risk classification
    assert result["risk_level"] == "MEDIUM"

    # Explanation
    assert "Retry amplification" in result["risk_explanation"]
    assert "Request failures" in result["risk_explanation"]
    assert "Cascading failures" in result["risk_explanation"]   
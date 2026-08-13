import pytest

from app.engines.fault_injection.engine import FaultInjectionEngine


def test_add_failure_fault():
    engine = FaultInjectionEngine()

    engine.add_fault("inventory", "failure", 10)

    assert engine.get_faults() == [
        {
            "service": "inventory",
            "fault_type": "failure",
            "duration": 10
        }
    ]


def test_invalid_fault_type():
    engine = FaultInjectionEngine()

    with pytest.raises(ValueError):
        engine.add_fault("inventory", "unknown", 10)


def test_invalid_duration():
    engine = FaultInjectionEngine()

    with pytest.raises(ValueError):
        engine.add_fault("inventory", "failure", 0)
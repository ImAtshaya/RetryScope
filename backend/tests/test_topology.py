import pytest

from app.engines.topology.engine import TopologyEngine


def test_add_services():
    topology = TopologyEngine()

    topology.add_service("gateway")
    topology.add_service("order")
    topology.add_service("inventory")

    assert topology.get_services() == [
        "gateway",
        "order",
        "inventory"
    ]


def test_add_dependencies():
    topology = TopologyEngine()

    topology.add_service("gateway")
    topology.add_service("order")
    topology.add_service("inventory")

    topology.add_dependency("gateway", "order")
    topology.add_dependency("order", "inventory")

    assert topology.get_dependencies() == [
        ("gateway", "order"),
        ("order", "inventory")
    ]


def test_duplicate_service():
    topology = TopologyEngine()

    topology.add_service("gateway")

    with pytest.raises(ValueError):
        topology.add_service("gateway")


def test_unknown_dependency():
    topology = TopologyEngine()

    topology.add_service("gateway")

    with pytest.raises(ValueError):
        topology.add_dependency("gateway", "payment")
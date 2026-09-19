from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.dialects.postgresql import JSONB

from app.database.base import Base


class SimulationResult(Base):

    __tablename__ = "simulation_results"

    id = Column(Integer, primary_key=True, index=True)

    users = Column(Integer, nullable=False)

    service = Column(String, nullable=False)

    total_requests = Column(Integer, nullable=False)

    failed_requests = Column(Integer, nullable=False)

    successful_requests = Column(Integer, nullable=False)

    successful_users = Column(Integer, nullable=False)

    failed_users = Column(Integer, nullable=False)

    total_retries = Column(Integer, nullable=False)

    retry_amplification_factor = Column(
        Float,
        nullable=False
    )

    failure_rate = Column(
        Float,
        nullable=False
    )

    success_rate = Column(
        Float,
        nullable=False
    )

    average_retries = Column(
        Float,
        nullable=False
    )

    average_duration = Column(
        Float,
        nullable=False
    )

    max_retries_used = Column(
        Integer,
        nullable=False
    )

    user_metrics = Column(
        JSONB,
        nullable=False
    )

    retry_events = Column(
        JSONB,
        nullable=False
    )

    cascade_events = Column(
        JSONB,
        nullable=False
    )

    service_metrics = Column(
        JSONB,
        nullable=False
    )
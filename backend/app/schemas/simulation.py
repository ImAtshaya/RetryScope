from pydantic import BaseModel, Field


class SimulationRequest(BaseModel):

    number_of_users: int = Field(
        default=5,
        gt=0
    )

    service_name: str = "inventory"

    requests_per_user: int = Field(
        default=1,
        gt=0
    )

    duration: float = Field(
        default=30,
        gt=0
    )

    failure_rate: float = Field(
        default=0,
        ge=0,
        le=100
    )
    random_seed: int| None = None 
    
    max_retries: int = Field(
        default=2,
        ge=0,
        le=10
    )

    backoff: str = "exponential"

    base_retry_delay: float = Field(
        default=1,
        gt=0
    )

    backoff_multiplier: float = Field(
        default=2,
        gt=0
    )

    jitter: bool = False

    timeout: float = Field(
        default=1000,
        gt=0
    )
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.engines.topology.instance import topology_engine


router = APIRouter(
    prefix="/topology",
    tags=["Topology"]
)


class TopologyRequest(BaseModel):
    services: list[str]
    dependencies: list[list[str]]


@router.post("/validate")
def validate_topology(request: TopologyRequest):

    # Clear previous topology
    topology_engine.graph.clear()

    try:

        # Add services
        for service in request.services:

            topology_engine.add_service(
                service
            )

        # Add dependencies
        for dependency in request.dependencies:

            if len(dependency) != 2:

                raise ValueError(
                    "Each dependency must contain source and target"
                )

            source, target = dependency

            topology_engine.add_dependency(
                source,
                target
            )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    return {

        "services":
            topology_engine.get_services(),

        "dependencies": [

            list(dependency)

            for dependency
            in topology_engine.get_dependencies()

        ],

        "valid": True
    }
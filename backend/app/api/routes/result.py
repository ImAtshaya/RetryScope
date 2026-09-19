from fastapi import APIRouter, HTTPException

from app.database.simulation_repository import get_simulation_result
from app.database.risk_repository import get_risk_result
from app.database.recommendation_repository import get_recommendation


router = APIRouter(
    prefix="/result",
    tags=["Results"]
)


@router.get("/{simulation_id}")
def get_result(simulation_id: int):

    # 1. Get simulation
    simulation = get_simulation_result(simulation_id)

    if simulation is None:
        raise HTTPException(
            status_code=404,
            detail="Simulation not found"
        )

    # 2. Get risk result
    risk = None

    # Find risk associated with this simulation
    from app.database.connection import get_connection

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM risk_results
            WHERE simulation_id = %s
            ORDER BY id DESC
            LIMIT 1
            """,
            (simulation_id,)
        )

        row = cursor.fetchone()

        if row:
            risk_id = row[0]
            risk = get_risk_result(risk_id)

    finally:
        cursor.close()
        connection.close()

    # 3. Get recommendation
    recommendation = None

    if risk:
        recommendation = get_recommendation_for_risk(risk["id"])

    return {
        "simulation": simulation,
        "risk": risk,
        "recommendation": recommendation
    }


def get_recommendation_for_risk(risk_id):

    from app.database.connection import get_connection

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM recommendations
            WHERE risk_result_id = %s
            ORDER BY id DESC
            LIMIT 1
            """,
            (risk_id,)
        )

        row = cursor.fetchone()

        if row is None:
            return None

        recommendation_id = row[0]

    finally:
        cursor.close()
        connection.close()

    return get_recommendation(recommendation_id)
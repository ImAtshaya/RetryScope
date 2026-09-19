from app.database.connection import get_connection


def save_risk_result(simulation_id, risk_result):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            INSERT INTO risk_results (
                simulation_id,
                retry_risk,
                failure_risk,
                cascade_risk,
                overall_score,
                risk_level,
                risk_explanation
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """

        cursor.execute(
            query,
            (
                simulation_id,
                risk_result["retry_risk"],
                risk_result["failure_risk"],
                risk_result["cascade_risk"],
                risk_result["overall_score"],
                risk_result["risk_level"],
                risk_result["risk_explanation"],
            )
        )

        risk_id = cursor.fetchone()[0]

        connection.commit()

        return risk_id

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()
        
def get_risk_result(risk_id):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                id,
                simulation_id,
                retry_risk,
                failure_risk,
                cascade_risk,
                overall_score,
                risk_level,
                risk_explanation
            FROM risk_results
            WHERE id = %s
        """

        cursor.execute(query, (risk_id,))

        row = cursor.fetchone()

        if row is None:
            return None

        return {
            "id": row[0],
            "simulation_id": row[1],
            "retry_risk": row[2],
            "failure_risk": row[3],
            "cascade_risk": row[4],
            "overall_score": row[5],
            "risk_level": row[6],
            "risk_explanation": row[7],
        }

    finally:
        cursor.close()
        connection.close()
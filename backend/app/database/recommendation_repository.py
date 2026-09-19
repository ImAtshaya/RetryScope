from app.database.connection import get_connection


def save_recommendation(risk_result_id, recommendation_result):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            INSERT INTO recommendations (
                risk_result_id,
                risk_level,
                overall_score,
                recommended_max_retries,
                recommended_backoff_multiplier,
                recommended_jitter,
                recommended_circuit_breaker,
                recommended_dependency_isolation,
                recommendation_text
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """

        retry = recommendation_result["retry"]
        backoff = recommendation_result["backoff"]
        jitter = recommendation_result["jitter"]
        failure_handling = recommendation_result["failure_handling"]

        cursor.execute(
            query,
            (
                risk_result_id,
                recommendation_result["risk_level"],
                recommendation_result["overall_score"],
                retry["recommended_max_retries"],
                backoff["recommended_backoff_multiplier"],
                jitter["recommended_jitter"],
                failure_handling["recommended_circuit_breaker"],
                failure_handling["recommended_dependency_isolation"],
                (
                    retry["recommendation"]
                    + " "
                    + backoff["recommendation"]
                    + " "
                    + jitter["recommendation"]
                    + " "
                    + failure_handling["recommendation"]
                ),
            )
        )

        recommendation_id = cursor.fetchone()[0]

        connection.commit()

        return recommendation_id

    finally:
        cursor.close()
        connection.close()
        
def get_recommendation(recommendation_id):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            SELECT
                id,
                risk_result_id,
                risk_level,
                overall_score,
                recommended_max_retries,
                recommended_backoff_multiplier,
                recommended_jitter,
                recommended_circuit_breaker,
                recommended_dependency_isolation,
                recommendation_text
            FROM recommendations
            WHERE id = %s
        """

        cursor.execute(query, (recommendation_id,))

        row = cursor.fetchone()

        if row is None:
            return None

        return {
            "id": row[0],
            "risk_result_id": row[1],
            "risk_level": row[2],
            "overall_score": row[3],
            "recommended_max_retries": row[4],
            "recommended_backoff_multiplier": row[5],
            "recommended_jitter": row[6],
            "recommended_circuit_breaker": row[7],
            "recommended_dependency_isolation": row[8],
            "recommendation_text": row[9],
        }

    finally:
        cursor.close()
        connection.close()
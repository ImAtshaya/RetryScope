import json

from app.database.connection import get_connection


def save_simulation_result(simulation_result):

    connection = get_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO simulation_results (
            users,
            service,
            total_requests,
            failed_requests,
            successful_requests,
            successful_users,
            failed_users,
            total_retries,
            retry_amplification_factor,
            failure_rate,
            success_rate,
            average_retries,
            average_duration,
            max_retries,
            max_retries_used,
            configured_failure_rate,
            timeout,
            backoff,
            retry_events,
            cascade_events,
            timeout_events,
            latency_events,
            error_rate_events
        )
        VALUES (
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s,
            %s, %s, %s
        )
        RETURNING id
    """

    values = (
        simulation_result["users"],
        simulation_result["service"],
        simulation_result["total_requests"],
        simulation_result["failed_requests"],
        simulation_result["successful_requests"],
        simulation_result["successful_users"],
        simulation_result["failed_users"],
        simulation_result["total_retries"],
        simulation_result["retry_amplification_factor"],
        simulation_result["failure_rate"],
        simulation_result["success_rate"],
        simulation_result["average_retries"],
        simulation_result["average_duration"],
        simulation_result["max_retries"],
        simulation_result["max_retries_used"],
        simulation_result["configured_failure_rate"],
        simulation_result["timeout"],
        simulation_result["backoff"],
        json.dumps(simulation_result.get("retry_events", [])),
        json.dumps(simulation_result.get("cascade_events", [])),
        json.dumps(simulation_result.get("timeout_events", [])),
        json.dumps(simulation_result.get("latency_events", [])),
        json.dumps(simulation_result.get("error_rate_events", [])),
    )

    cursor.execute(query, values)

    simulation_id = cursor.fetchone()[0]

    connection.commit()

    cursor.close()
    connection.close()

    return simulation_id


def parse_json_field(value):

    if value is None:
        return []

    if isinstance(value, (list, dict)):
        return value

    try:
        return json.loads(value)
    except (TypeError, ValueError):
        return []


def get_simulation_result(simulation_id):

    connection = get_connection()
    cursor = connection.cursor()

    query = """
        SELECT
            id,
            users,
            service,
            total_requests,
            failed_requests,
            successful_requests,
            successful_users,
            failed_users,
            total_retries,
            retry_amplification_factor,
            failure_rate,
            success_rate,
            average_retries,
            average_duration,
            max_retries,
            max_retries_used,
            configured_failure_rate,
            timeout,
            backoff,
            retry_events,
            cascade_events,
            timeout_events,
            latency_events,
            error_rate_events
        FROM simulation_results
        WHERE id = %s
    """

    cursor.execute(query, (simulation_id,))

    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row is None:
        return None

    return {
        "id": row[0],
        "users": row[1],
        "service": row[2],
        "total_requests": row[3],
        "failed_requests": row[4],
        "successful_requests": row[5],
        "successful_users": row[6],
        "failed_users": row[7],
        "total_retries": row[8],
        "retry_amplification_factor": row[9],
        "failure_rate": row[10],
        "success_rate": row[11],
        "average_retries": row[12],
        "average_duration": row[13],
        "max_retries": row[14],
        "max_retries_used": row[15],
        "configured_failure_rate": row[16],
        "timeout": row[17],
        "backoff": row[18],
        "retry_events": parse_json_field(row[19]),
        "cascade_events": parse_json_field(row[20]),
        "timeout_events": parse_json_field(row[21]),
        "latency_events": parse_json_field(row[22]),
        "error_rate_events": parse_json_field(row[23]),
    }
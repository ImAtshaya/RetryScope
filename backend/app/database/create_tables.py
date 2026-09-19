from app.database.connection import get_connection


def create_tables():

    connection = get_connection()
    cursor = connection.cursor()

    # ==========================================
    # Simulation Results
    # ==========================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS simulation_results (
            id SERIAL PRIMARY KEY,
            users INTEGER NOT NULL,
            service VARCHAR(100) NOT NULL,
            total_requests INTEGER NOT NULL,
            failed_requests INTEGER NOT NULL,
            successful_requests INTEGER NOT NULL,
            successful_users INTEGER NOT NULL,
            failed_users INTEGER NOT NULL,
            total_retries INTEGER NOT NULL,
            retry_amplification_factor FLOAT NOT NULL,
            failure_rate FLOAT NOT NULL,
            success_rate FLOAT NOT NULL,
            average_retries FLOAT NOT NULL,
            average_duration FLOAT NOT NULL,
            max_retries INTEGER NOT NULL,
            max_retries_used INTEGER NOT NULL,
            configured_failure_rate FLOAT NOT NULL,
            timeout INTEGER NOT NULL,
            backoff VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # ==========================================
    # Risk Results
    # ==========================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS risk_results (
            id SERIAL PRIMARY KEY,
            simulation_id INTEGER REFERENCES simulation_results(id),
            retry_risk INTEGER NOT NULL,
            failure_risk INTEGER NOT NULL,
            cascade_risk INTEGER NOT NULL,
            overall_score FLOAT NOT NULL,
            risk_level VARCHAR(20) NOT NULL,
            risk_explanation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # ==========================================
    # Recommendations
    # ==========================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS recommendations (
            id SERIAL PRIMARY KEY,
            risk_result_id INTEGER REFERENCES risk_results(id),
            risk_level VARCHAR(20) NOT NULL,
            overall_score FLOAT NOT NULL,
            recommended_max_retries INTEGER,
            recommended_backoff_multiplier FLOAT,
            recommended_jitter BOOLEAN,
            recommended_circuit_breaker BOOLEAN,
            recommended_dependency_isolation BOOLEAN,
            recommendation_text TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)


    # ==========================================
    # Simulation Event Data
    # ==========================================

    cursor.execute("""
        ALTER TABLE simulation_results
        ADD COLUMN IF NOT EXISTS retry_events JSONB
    """)

    cursor.execute("""
        ALTER TABLE simulation_results
        ADD COLUMN IF NOT EXISTS cascade_events JSONB
    """)

    cursor.execute("""
        ALTER TABLE simulation_results
        ADD COLUMN IF NOT EXISTS timeout_events JSONB
    """)

    cursor.execute("""
        ALTER TABLE simulation_results
        ADD COLUMN IF NOT EXISTS latency_events JSONB
    """)

    cursor.execute("""
        ALTER TABLE simulation_results
        ADD COLUMN IF NOT EXISTS error_rate_events JSONB
    """)
    
    connection.commit()

    cursor.close()
    connection.close()

    print("Database tables created successfully.")


if __name__ == "__main__":
    create_tables()
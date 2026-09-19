from locust import HttpUser, task, between


class RetryScopeUser(HttpUser):

    wait_time = between(1, 2)

    @task
    def run_simulation(self):

        payload = {
            "number_of_users": 10,
            "service_name": "inventory",
            "max_retries": 2,
            "base_retry_delay": 1,
            "backoff_multiplier": 2,
            "jitter": False
        }

        self.client.post(
            "/simulation/run",
            json=payload,
            name="/simulation/run"
        )
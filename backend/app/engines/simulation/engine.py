import simpy


class SimulationEngine:

    def __init__(self, fault_engine=None):

        self.env = simpy.Environment()

        self.fault_engine = fault_engine

        self.total_requests = 0
        self.failed_requests = 0
        self.successful_requests = 0
        self.retry_count = 0

    def process_request(
        self,
        user_id,
        service_name,
        max_retries=2
    ):

        attempt = 0

        while attempt <= max_retries:

            self.total_requests += 1

            print(
                f"User {user_id}: "
                f"Attempt {attempt + 1} "
                f"for {service_name}"
            )

            # Simulate processing time
            yield self.env.timeout(1)

            current_time = self.env.now

            # Check whether the service is currently failing
            service_failed = False

            if self.fault_engine:

                service_failed = (
                    self.fault_engine.is_service_failed(
                        service_name,
                        current_time
                    )
                )

            # Handle failure
            if service_failed:

                self.failed_requests += 1

                print(
                    f"User {user_id}: "
                    f"Request failed"
                )

                if attempt < max_retries:

                    self.retry_count += 1

                    print(
                        f"User {user_id}: "
                        f"Retrying..."
                    )

                attempt += 1

            # Handle success
            else:

                self.successful_requests += 1

                print(
                    f"User {user_id}: "
                    f"Request succeeded"
                )

                break

    def run(self, number_of_users=5, max_retries=2):

        for user_id in range(
            1,
            number_of_users + 1
        ):

            self.env.process(
                self.process_request(
                    user_id,
                    "inventory",
                    max_retries=max_retries
                )
            )

        self.env.run()

        print("\n--- Simulation Results ---")

        print(
            f"Users: "
            f"{number_of_users}"
        )

        print(
            f"Total requests: "
            f"{self.total_requests}"
        )

        print(
            f"Failed requests: "
            f"{self.failed_requests}"
        )

        print(
            f"Successful requests: "
            f"{self.successful_requests}"
        )

        print(
            f"Total retries: "
            f"{self.retry_count}"
        )

        amplification_factor = (
            self.total_requests / number_of_users
        )

        print(
            f"Retry amplification factor: "
            f"{amplification_factor:.2f}x"
        )
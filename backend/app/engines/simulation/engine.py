import random
import simpy


class SimulationEngine:

    def __init__(
        self,
        fault_engine=None,
        topology_engine=None
    ):
        self.env = simpy.Environment()

        self.fault_engine = fault_engine
        self.topology_engine = topology_engine

        self.original_requests = 0
        self.total_requests = 0
        self.total_attempts = 0

        self.failed_requests = 0
        self.successful_requests = 0

        self.retry_count = 0

        self.user_metrics = {}

        self.retry_events = []
        self.cascade_events = []

        self.service_metrics = {}

        self.timeout_events = []
        self.latency_events = []
        self.error_rate_events = []

    # ==========================================================
    # RESET
    # ==========================================================

    def reset_metrics(self):

        self.env = simpy.Environment()

        self.original_requests = 0
        self.total_requests = 0
        self.total_attempts = 0

        self.failed_requests = 0
        self.successful_requests = 0

        self.retry_count = 0

        self.user_metrics = {}

        self.retry_events = []
        self.cascade_events = []

        self.service_metrics = {}

        self.timeout_events = []
        self.latency_events = []
        self.error_rate_events = []

    # ==========================================================
    # SERVICE CHAIN
    # ==========================================================

    def get_service_chain(self, service_name):

        if not self.topology_engine:
            return [service_name]

        chain = []
        visited = set()

        def visit(service):

            if not service:
                return

            if service in visited:
                return

            visited.add(service)
            chain.append(service)

            dependencies = (
                self.topology_engine
                .get_dependencies_for(service)
            )

            if not dependencies:
                return

            for dependency in dependencies:
                visit(dependency)

        visit(service_name)

        return chain

    # ==========================================================
    # SERVICE METRICS
    # ==========================================================

    def ensure_service_metric(self, service_name):

        if service_name not in self.service_metrics:

            self.service_metrics[service_name] = {
                "requests": 0,
                "failed": 0,
                "successful": 0,
                "retries": 0
            }

        return self.service_metrics[service_name]

    # ==========================================================

    def record_service_attempt(self, service_name):

        metrics = self.ensure_service_metric(service_name)

        metrics["requests"] += 1

    # ==========================================================

    def record_service_success(self, service_name):

        metrics = self.ensure_service_metric(service_name)

        metrics["successful"] += 1

    # ==========================================================

    def record_service_failure(self, service_name):

        metrics = self.ensure_service_metric(service_name)

        metrics["failed"] += 1

    # ==========================================================

    def record_service_retry(self, service_name):

        metrics = self.ensure_service_metric(service_name)

        metrics["retries"] += 1

    # ==========================================================
    # RETRY DELAY
    # ==========================================================

    def calculate_retry_delay(
        self,
        attempt,
        base_retry_delay,
        backoff_multiplier,
        backoff,
        jitter
    ):

        if backoff == "exponential":

            retry_delay = (
                base_retry_delay
                * (
                    backoff_multiplier
                    ** attempt
                )
            )

        elif backoff == "fixed":

            retry_delay = base_retry_delay

        else:

            retry_delay = base_retry_delay

        if jitter:

            retry_delay = random.uniform(
                0,
                retry_delay
            )

        return retry_delay

    # ==========================================================
    # POLICY-AWARE FAILURE RATE
    # ==========================================================

    def calculate_policy_aware_failure_rate(
        self,
        failure_rate,
        attempt,
        backoff,
        jitter
    ):
        """
        Model retry-induced load pressure.

        Initial attempts use the configured failure rate.

        Aggressive fixed-delay retries become progressively
        more likely to fail because retries arrive rapidly.

        Exponential backoff with jitter reduces retry pressure.
        """

        base_rate = (
            float(failure_rate) / 100
        )

        base_rate = max(
            0,
            min(base_rate, 1)
        )

        if attempt <= 0:
            return base_rate

        # ------------------------------------------------------
        # Aggressive fixed retry policy
        # ------------------------------------------------------

        if backoff == "fixed":

            effective_rate = (
                base_rate
                + (0.08 * attempt)
            )

            return max(
                0,
                min(effective_rate, 0.95)
            )

        # ------------------------------------------------------
        # Exponential + jitter
        # Reduces pressure on later retries.
        # ------------------------------------------------------

        if backoff == "exponential" and jitter:

            effective_rate = (
                base_rate
                * (0.85 ** attempt)
            )

            return max(
                0,
                min(effective_rate, 1)
            )

        # ------------------------------------------------------
        # Normal exponential backoff
        # ------------------------------------------------------

        if backoff == "exponential":

            return base_rate

        return base_rate

    # ==========================================================
    # REGISTER RETRY
    # ==========================================================

    def register_retry(
        self,
        user_id,
        service_name,
        attempt,
        reason,
        base_retry_delay,
        backoff_multiplier,
        backoff,
        jitter,
        request_id=None
    ):

        self.retry_count += 1

        self.record_service_retry(
            service_name
        )

        retry_number = attempt + 1

        retry_delay = self.calculate_retry_delay(
            attempt=attempt,
            base_retry_delay=base_retry_delay,
            backoff_multiplier=backoff_multiplier,
            backoff=backoff,
            jitter=jitter
        )

        retry_time = (
            self.env.now
            + retry_delay
        )

        event = {

            "request_id": request_id,

            "user_id": user_id,

            "service": service_name,

            "attempt": attempt + 1,

            "retry_number": retry_number,

            "retry_delay": retry_delay,

            "retry_time": retry_time,

            "time": self.env.now,

            "reason": reason
        }

        self.retry_events.append(event)

        return retry_delay

    # ==========================================================
    # CALL SERVICE
    # ==========================================================

    def call_service(
        self,
        user_id,
        service_name,
        max_retries=2,
        base_retry_delay=1,
        backoff_multiplier=2,
        backoff="exponential",
        jitter=False,
        timeout=1000,
        failure_rate=0,
        request_id=None
    ):

        attempt = 0

        while attempt <= max_retries:

            # --------------------------------------------------
            # ACTUAL SERVICE ATTEMPT
            # --------------------------------------------------

            self.total_attempts += 1

            self.record_service_attempt(
                service_name
            )

            current_time = self.env.now

            # --------------------------------------------------
            # BASE PROCESSING TIME
            # --------------------------------------------------

            processing_time = 1.0

            # --------------------------------------------------
            # LATENCY FAULT
            # --------------------------------------------------

            latency_ms = 0

            if self.fault_engine:

                latency_ms = (
                    self.fault_engine
                    .get_latency_ms(
                        service_name,
                        current_time
                    )
                )

            if latency_ms > 0:

                latency_seconds = (
                    latency_ms / 1000
                )

                processing_time += (
                    latency_seconds
                )

                self.latency_events.append({

                    "request_id": request_id,

                    "user_id": user_id,

                    "service": service_name,

                    "latency_ms": latency_ms,

                    "time": current_time
                })

            # --------------------------------------------------
            # TIMEOUT
            # --------------------------------------------------

            timeout_triggered = False

            injected_timeout_ms = None

            if self.fault_engine:

                injected_timeout_ms = (
                    self.fault_engine
                    .get_timeout_ms(
                        service_name,
                        current_time
                    )
                )
                
                print(
                    "DEBUG TIMEOUT:",
                    service_name,
                    injected_timeout_ms
                )
            if injected_timeout_ms is not None:

                timeout_seconds = (
                    injected_timeout_ms / 1000
                )

                # A configured timeout fault intentionally forces
                # the service call to time out.
                yield self.env.timeout(
                    timeout_seconds
                )

                timeout_triggered = True

            else:

                yield self.env.timeout(
                    processing_time
                )

            current_time = self.env.now

            # ==================================================
            # FAILURE DECISION
            # ==================================================

            failure_reason = None

            # --------------------------------------------------
            # TIMEOUT FAILURE
            # --------------------------------------------------

            if timeout_triggered:

                self.record_service_failure(
                    service_name
                )

                self.timeout_events.append({

                    "request_id": request_id,

                    "user_id": user_id,

                    "service": service_name,

                    "timeout_ms": injected_timeout_ms,

                    "time": current_time
                })

                failure_reason = "timeout"

            else:

                # ------------------------------------------------
                # EXPLICIT FAULT
                # ------------------------------------------------

                service_failed = False

                if self.fault_engine:

                    service_failed = (
                        self.fault_engine
                        .is_service_failed(
                            service_name,
                            current_time
                        )
                    )

                # ------------------------------------------------
                # POLICY-AWARE RANDOM FAILURE
                # ------------------------------------------------

                random_failure = False

                if failure_rate > 0:

                    effective_failure_rate = (
                        self.calculate_policy_aware_failure_rate(
                            failure_rate=failure_rate,
                            attempt=attempt,
                            backoff=backoff,
                            jitter=jitter
                        )
                    )

                    random_failure = (
                        random.random()
                        < effective_failure_rate
                    )

                # ------------------------------------------------
                # ERROR RATE FAILURE
                # ------------------------------------------------

                error_rate_failure = False

                if self.fault_engine:

                    error_rate_failure = (
                        self.fault_engine
                        .should_fail_error_rate(
                            service_name,
                            current_time
                        )
                    )

                if error_rate_failure:

                    self.error_rate_events.append({

                        "request_id": request_id,

                        "user_id": user_id,

                        "service": service_name,

                        "time": current_time
                    })

                # ------------------------------------------------
                # FINAL FAILURE
                # ------------------------------------------------

                service_failed = (
                    service_failed
                    or random_failure
                    or error_rate_failure
                )

                if service_failed:

                    self.record_service_failure(
                        service_name
                    )

                    if error_rate_failure:

                        failure_reason = (
                            "error_rate"
                        )

                    elif random_failure:

                        failure_reason = (
                            "failure_rate"
                        )

                    else:

                        failure_reason = (
                            "failure"
                        )

            # ==================================================
            # DIRECT SERVICE FAILURE -> RETRY
            # ==================================================

            if failure_reason:

                if attempt < max_retries:

                    retry_delay = (
                        self.register_retry(
                            user_id=user_id,
                            service_name=service_name,
                            attempt=attempt,
                            reason=failure_reason,
                            base_retry_delay=base_retry_delay,
                            backoff_multiplier=backoff_multiplier,
                            backoff=backoff,
                            jitter=jitter,
                            request_id=request_id
                        )
                    )

                    yield self.env.timeout(
                        retry_delay
                    )

                    attempt += 1

                    continue

                # ------------------------------------------------
                # No retries remaining.
                # Final request failure is handled by
                # process_request().
                # ------------------------------------------------

                return False

            # ==================================================
            # SERVICE SUCCEEDED
            # ==================================================

            self.record_service_success(
                service_name
            )

            # ==================================================
            # DEPENDENCIES
            # ==================================================

            dependencies = []

            if self.topology_engine:

                dependencies = (
                    self.topology_engine
                    .get_dependencies_for(
                        service_name
                    )
                    or []
                )

            dependency_failed = False

            failed_dependency = None

            for dependency in dependencies:

                dependency_result = (
                    yield from self.call_service(
                        user_id=user_id,
                        service_name=dependency,
                        max_retries=max_retries,
                        base_retry_delay=base_retry_delay,
                        backoff_multiplier=backoff_multiplier,
                        backoff=backoff,
                        jitter=jitter,
                        timeout=timeout,
                        failure_rate=failure_rate,
                        request_id=request_id
                    )
                )

                if not dependency_result:

                    dependency_failed = True

                    failed_dependency = (
                        dependency
                    )

                    self.cascade_events.append({

                        "request_id": request_id,

                        "user_id": user_id,

                        "failed_service": dependency,

                        "affected_service": service_name,

                        "time": self.env.now
                    })

                    break

            # ==================================================
            # DEPENDENCY FAILURE
            # ==================================================

            if dependency_failed:

                if attempt < max_retries:

                    retry_delay = (
                        self.register_retry(
                            user_id=user_id,
                            service_name=service_name,
                            attempt=attempt,
                            reason="dependency_failure",
                            base_retry_delay=base_retry_delay,
                            backoff_multiplier=backoff_multiplier,
                            backoff=backoff,
                            jitter=jitter,
                            request_id=request_id
                        )
                    )

                    yield self.env.timeout(
                        retry_delay
                    )

                    attempt += 1

                    continue

                return False

            # ==================================================
            # COMPLETE SUCCESS
            # ==================================================

            return True

        return False

    # ==========================================================
    # PROCESS ONE ORIGINAL REQUEST
    # ==========================================================

    def process_request(
        self,
        user_id,
        request_number,
        service_name,
        max_retries,
        base_retry_delay,
        backoff_multiplier,
        backoff,
        jitter,
        timeout,
        failure_rate
    ):

        self.total_requests += 1

        request_id = (
            f"user-{user_id}-request-{request_number}"
        )

        start_time = self.env.now

        service_chain = (
            self.get_service_chain(
                service_name
            )
        )

        # ------------------------------------------------------
        # Each original request gets its own ID.
        # ------------------------------------------------------

        success = (
            yield from self.call_service(
                user_id=user_id,
                service_name=service_name,
                max_retries=max_retries,
                base_retry_delay=base_retry_delay,
                backoff_multiplier=backoff_multiplier,
                backoff=backoff,
                jitter=jitter,
                timeout=timeout,
                failure_rate=failure_rate,
                request_id=request_id
            )
        )

        duration = (
            self.env.now
            - start_time
        )

        # ------------------------------------------------------
        # EXACT RETRIES FOR THIS REQUEST
        # ------------------------------------------------------

        request_retry_events = [

            event

            for event in self.retry_events

            if event.get("request_id")
            == request_id

        ]

        request_retry_count = len(
            request_retry_events
        )

        # ------------------------------------------------------
        # FINAL STATUS
        #
        # A request is failed only after every allowed retry
        # has been exhausted.
        # ------------------------------------------------------

        if success:

            self.successful_requests += 1

            final_status = "success"

        else:

            self.failed_requests += 1

            final_status = "failed"

        # ------------------------------------------------------
        # STORE REQUEST METRICS
        # ------------------------------------------------------

        self.user_metrics[request_id] = {

            "request_id": request_id,

            "user_id": user_id,

            "request_number": request_number,

            "service": service_name,

            "service_chain": service_chain,

            "status": final_status,

            "retries": request_retry_count,

            "duration": duration
        }

    # ==========================================================
    # COUNT USER RETRIES
    # ==========================================================
    # ==========================================================
    # RUN
    # ==========================================================

    def run(
        self,
        number_of_users=5,
        service_name="inventory",
        requests_per_user=1,
        duration=30,
        failure_rate=0,
        random_seed=None,
        max_retries=2,
        backoff="exponential",
        base_retry_delay=1,
        backoff_multiplier=2,
        jitter=False,
        timeout=1000
    ):

        # ======================================================
        # RESET
        # ======================================================

        self.reset_metrics()

        if random_seed is not None:

            random.seed(
                random_seed
            )

        # ======================================================
        # VALIDATE
        # ======================================================

        number_of_users = int(
            number_of_users
        )

        requests_per_user = int(
            requests_per_user
        )

        duration = float(
            duration
        )

        failure_rate = float(
            failure_rate
        )

        max_retries = int(
            max_retries
        )

        base_retry_delay = float(
            base_retry_delay
        )

        backoff_multiplier = float(
            backoff_multiplier
        )

        timeout = float(
            timeout
        )

        if number_of_users <= 0:

            raise ValueError(
                "number_of_users must be greater than 0"
            )

        if requests_per_user <= 0:

            raise ValueError(
                "requests_per_user must be greater than 0"
            )

        if duration <= 0:

            raise ValueError(
                "duration must be greater than 0"
            )

        if max_retries < 0:

            raise ValueError(
                "max_retries cannot be negative"
            )

        if failure_rate < 0:

            raise ValueError(
                "failure_rate cannot be negative"
            )

        if failure_rate > 100:

            raise ValueError(
                "failure_rate cannot exceed 100"
            )

        # ======================================================
        # CREATE ORIGINAL REQUESTS
        # ======================================================

        for user_id in range(
            1,
            number_of_users + 1
        ):

            for request_number in range(
                1,
                requests_per_user + 1
            ):

                self.original_requests += 1

                self.env.process(
                    self.process_request(
                        user_id=user_id,
                        request_number=request_number,
                        service_name=service_name,
                        max_retries=max_retries,
                        base_retry_delay=base_retry_delay,
                        backoff_multiplier=backoff_multiplier,
                        backoff=backoff,
                        jitter=jitter,
                        timeout=timeout,
                        failure_rate=failure_rate
                    )
                )

        # ======================================================
        # RUN SIMULATION
        # ======================================================

        self.env.run()

        # ======================================================
        # COMPLETED REQUESTS
        # ======================================================

        completed_requests = len(
            self.user_metrics
        )

        # ======================================================
        # FINAL COUNTS FROM ACTUAL REQUEST RESULTS
        # ======================================================

        successful_requests = sum(

            1

            for metrics
            in self.user_metrics.values()

            if metrics["status"]
            == "success"

        )

        failed_requests = sum(

            1

            for metrics
            in self.user_metrics.values()

            if metrics["status"]
            == "failed"

        )

        self.successful_requests = (
            successful_requests
        )

        self.failed_requests = (
            failed_requests
        )

        # ======================================================
        # USER COUNTS
        # ======================================================

        successful_users = sum(

            1

            for metrics
            in self.user_metrics.values()

            if metrics["status"]
            == "success"

        )

        failed_users = (
            completed_requests
            - successful_users
        )

        # ======================================================
        # RATES
        # ======================================================

        success_rate = (

            successful_requests
            / completed_requests

            if completed_requests > 0

            else 0

        )

        actual_failure_rate = (

            failed_requests
            / completed_requests

            if completed_requests > 0

            else 0

        )

        # ======================================================
        # RETRY COUNT
        # ======================================================

        total_retries = len(
            self.retry_events
        )

        self.retry_count = (
            total_retries
        )

        average_retries = (

            total_retries
            / completed_requests

            if completed_requests > 0

            else 0

        )

        # ======================================================
        # DURATIONS
        # ======================================================

        durations = [

            metrics["duration"]

            for metrics
            in self.user_metrics.values()

        ]

        average_duration = (

            sum(durations)
            / len(durations)

            if durations

            else 0

        )

        # ======================================================
        # MAX RETRIES USED
        # ======================================================

        max_retries_used = max(
            (

                metrics["retries"]
                for metrics in self.user_metrics.values()

                ),

                default=0

            )

        # ======================================================
        # RETRY AMPLIFICATION
        #
        # Original workload =
        # original requests
        #
        # Additional workload =
        # actual retry attempts
        #
        # Amplification =
        # (original requests + actual retries)
        # / original requests
        # ======================================================

        original_requests = (
            self.original_requests
        )

        total_request_attempts = (

            original_requests
            + self.retry_count

        )

        retry_amplification_factor = (

            total_request_attempts
            / original_requests

            if original_requests > 0

            else 1.0

        )

        # ======================================================
        # RETURN
        # ======================================================

        return {

            "users":
                number_of_users,

            "service":
                service_name,

            "requests_per_user":
                requests_per_user,

            "duration":
                duration,

            "configured_failure_rate":
                failure_rate,

            "random_seed":
                random_seed,

            "timeout":
                timeout,

            "backoff":
                backoff,

            "base_retry_delay":
                base_retry_delay,

            "backoff_multiplier":
                backoff_multiplier,

            "jitter":
                jitter,

            # --------------------------------------------------
            # ORIGINAL REQUESTS
            # --------------------------------------------------

            "total_requests":
                self.original_requests,

            "original_requests":
                self.original_requests,

            "baseline_service_calls":
                self.original_requests,

            # --------------------------------------------------
            # TOTAL ATTEMPTS
            # --------------------------------------------------

            "total_attempts":
                self.total_attempts,

            "total_request_attempts":
                total_request_attempts,

            # --------------------------------------------------
            # FINAL REQUEST RESULTS
            # --------------------------------------------------

            "completed_requests":
                completed_requests,

            "failed_requests":
                failed_requests,

            "successful_requests":
                successful_requests,

            "successful_users":
                successful_users,

            "failed_users":
                failed_users,

            # --------------------------------------------------
            # RETRIES
            # --------------------------------------------------

            "total_retries":
                self.retry_count,

            "retry_attempts":
                self.retry_count,

            "retry_amplification_factor":
                retry_amplification_factor,

            "retry_amplification":
                retry_amplification_factor,

            # --------------------------------------------------
            # RATES
            # --------------------------------------------------

            "failure_rate":
                actual_failure_rate,

            "success_rate":
                success_rate,

            "average_retries":
                average_retries,

            "average_duration":
                average_duration,


            "max_retries":
                max_retries,
            "max_retries_used":
                max_retries_used,

            # --------------------------------------------------
            # DETAILED DATA
            # --------------------------------------------------

            "user_metrics":
                self.user_metrics,

            "retry_events":
                self.retry_events,

            "cascade_events":
                self.cascade_events,

            "timeout_events":
                self.timeout_events,

            "latency_events":
                self.latency_events,

            "error_rate_events":
                self.error_rate_events,

            "service_metrics":
                self.service_metrics
        }
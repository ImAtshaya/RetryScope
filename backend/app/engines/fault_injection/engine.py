import random


class FaultInjectionEngine:

    VALID_FAULT_TYPES = {
        "failure",
        "latency",
        "unavailable",
        "timeout",
        "error_rate"
    }

    def __init__(self):
        self.faults = []

    def add_fault(
        self,
        service,
        fault_type,
        duration,
        timeout_ms=None,
        latency_ms=None,
        error_percentage=None
    ):
        if fault_type not in self.VALID_FAULT_TYPES:
            raise ValueError(
                f"Invalid fault type: {fault_type}"
            )

        if duration <= 0:
            raise ValueError(
                "Duration must be greater than 0"
            )

        if not service:
            raise ValueError(
                "Service name is required"
            )

        if fault_type == "timeout":

            if timeout_ms is None or timeout_ms <= 0:
                raise ValueError(
                    "Timeout must be greater than 0"
                )

        if fault_type == "latency":

            if latency_ms is None or latency_ms <= 0:
                raise ValueError(
                    "Latency must be greater than 0"
                )

        if fault_type == "error_rate":

            if (
                error_percentage is None
                or error_percentage < 1
                or error_percentage > 100
            ):
                raise ValueError(
                    "Error percentage must be between 1 and 100"
                )

        fault = {
            "service": service,
            "fault_type": fault_type,
            "duration": duration
        }

        if fault_type == "timeout":
            fault["timeout_ms"] = timeout_ms

        if fault_type == "latency":
            fault["latency_ms"] = latency_ms

        if fault_type == "error_rate":
            fault["error_percentage"] = error_percentage

        self.faults.append(fault)

        return fault

    def get_faults(self):
        return self.faults

    def clear_faults(self):
        self.faults = []

    # ==================================================
    # Find active faults
    # ==================================================

    def get_active_faults(
        self,
        service,
        current_time
    ):

        active_faults = []

        for fault in self.faults:

            if fault["service"] != service:
                continue

            start_time = 0
            end_time = start_time + fault["duration"]

            if start_time <= current_time < end_time:

                active_faults.append(fault)

        return active_faults

    # ==================================================
    # Failure
    # ==================================================

    def is_service_failed(
        self,
        service,
        current_time
    ):

        active_faults = self.get_active_faults(
            service,
            current_time
        )

        for fault in active_faults:

            if fault["fault_type"] in {
                "failure",
                "unavailable"
            }:
                return True

        return False

    # ==================================================
    # Timeout
    # ==================================================

    def get_timeout_ms(
        self,
        service,
        current_time
    ):

        active_faults = self.get_active_faults(
            service,
            current_time
        )

        for fault in active_faults:

            if fault["fault_type"] == "timeout":

                return fault["timeout_ms"]

        return None

    # ==================================================
    # Latency
    # ==================================================

    def get_latency_ms(
        self,
        service,
        current_time
    ):

        active_faults = self.get_active_faults(
            service,
            current_time
        )

        total_latency = 0

        for fault in active_faults:

            if fault["fault_type"] == "latency":

                total_latency += fault["latency_ms"]

        return total_latency

    # ==================================================
    # Error rate
    # ==================================================

    def should_fail_error_rate(
        self,
        service,
        current_time
    ):

        active_faults = self.get_active_faults(
            service,
            current_time
        )

        for fault in active_faults:

            if fault["fault_type"] == "error_rate":

                probability = (
                    fault["error_percentage"] / 100
                )

                if random.random() < probability:
                    return True

        return False
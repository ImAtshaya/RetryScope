class FaultInjectionEngine:

    VALID_FAULT_TYPES = {
        "failure",
        "latency",
        "unavailable"
    }

    def __init__(self):
        self.faults = []

    def add_fault(self, service, fault_type, duration):
        if fault_type not in self.VALID_FAULT_TYPES:
            raise ValueError(f"Invalid fault type: {fault_type}")

        if duration <= 0:
            raise ValueError("Duration must be greater than 0")

        fault = {
            "service": service,
            "fault_type": fault_type,
            "duration": duration
        }

        self.faults.append(fault)

    def get_faults(self):
        return self.faults

    def is_service_failed(self, service, current_time):
        for fault in self.faults:
            if (
                fault["service"] == service
                and fault["fault_type"] == "failure"
            ):
                start_time = 0
                end_time = start_time + fault["duration"]

                if start_time <= current_time < end_time:
                    return True

        return False
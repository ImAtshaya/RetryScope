class RiskEngine:

    def __init__(self):
        pass

    # ==========================================================
    # RETRY RISK
    # ==========================================================

    def calculate_retry_risk(self, retry_amplification_factor):
        """
        Convert retry amplification into a 0-100 risk score.

        Project thresholds:

            <= 1x  -> 0
            <= 2x  -> 25
            <= 5x  -> 50
            <= 10x -> 75
            > 10x  -> 100
        """

        amplification = float(
            retry_amplification_factor or 1.0
        )

        if amplification <= 1:
            return 0

        if amplification <= 2:
            return 25

        if amplification <= 5:
            return 50

        if amplification <= 10:
            return 75

        return 100

    # ==========================================================
    # FAILURE RISK
    # ==========================================================

    def calculate_failure_risk(self, failure_rate):
        """
        Calculate risk caused by actual request failures.

        failure_rate is expected as a decimal between 0 and 1.
        """

        rate = float(
            failure_rate or 0
        )

        rate = max(0.0, min(rate, 1.0))

        if rate <= 0:
            return 0

        if rate < 0.30:
            return 25

        if rate < 0.50:
            return 50

        if rate < 0.57:
            return 75

        return 100

    # ==========================================================
    # CASCADE RISK
    # ==========================================================

    def calculate_cascade_risk(
        self,
        cascade_events,
        total_requests=0
    ):
        """
        Convert cascade event count into a 0-100 risk score.

        Project thresholds:

            0       -> 0
            1-2     -> 25
            3-5     -> 50
            6-10    -> 75
            >10     -> 100

        The total_requests parameter is retained for compatibility
        with the existing project API.
        """

        if isinstance(cascade_events, list):
            cascade_count = len(cascade_events)
        else:
            cascade_count = int(
                cascade_events or 0
            )

        if cascade_count <= 0:
            return 0

        if cascade_count <= 2:
            return 25

        if cascade_count <= 5:
            return 50

        if cascade_count <= 10:
            return 75

        return 100

    # ==========================================================
    # OVERALL SCORE
    # ==========================================================

    def calculate_overall_score(
        self,
        retry_risk,
        failure_risk,
        cascade_risk
    ):
        """
        Combine the three risk components.

        Retry risk:   40%
        Failure risk: 30%
        Cascade risk: 30%
        """

        score = (
            retry_risk * 0.40
            + failure_risk * 0.30
            + cascade_risk * 0.30
        )

        return round(
            max(0, min(score, 100)),
            2
        )

    # ==========================================================
    # RISK CLASSIFICATION
    # ==========================================================

    def classify_risk(self, score):
        """
        Convert numerical risk score into LOW / MEDIUM / HIGH.
        """

        score = float(score)

        if score < 30:
            return "LOW"

        if score < 70:
            return "MEDIUM"

        return "HIGH"

    # ==========================================================
    # RISK EXPLANATION
    # ==========================================================

    def explain_risk(
        self,
        retry_risk,
        failure_risk,
        cascade_risk
    ):
        """
        Explain the factors contributing to system risk.
        """

        reasons = []

        if retry_risk > 0:
            reasons.append(
                "Retry amplification is contributing to system risk."
            )

        if failure_risk > 0:
            reasons.append(
                "Request failures are contributing to system risk."
            )

        if cascade_risk > 0:
            reasons.append(
                "Cascading failures are contributing to system risk."
            )

        if not reasons:
            return "No significant risk factors detected."

        return " ".join(reasons)

    # ==========================================================
    # COMPLETE ASSESSMENT
    # ==========================================================

    def assess(self, simulation_result):
        """
        Analyze simulation results and return
        a complete risk assessment.
        """

        retry_amplification = simulation_result.get(
            "retry_amplification_factor",
            simulation_result.get(
                "retry_amplification",
                1.0
            )
        )

        failure_rate = simulation_result.get(
            "failure_rate",
            0
        )

        cascade_events = simulation_result.get(
            "cascade_events",
            []
        )

        total_requests = simulation_result.get(
            "original_requests",
            simulation_result.get(
                "total_requests",
                0
            )
        )

        retry_risk = self.calculate_retry_risk(
            retry_amplification
        )

        failure_risk = self.calculate_failure_risk(
            failure_rate
        )

        cascade_risk = self.calculate_cascade_risk(
            cascade_events,
            total_requests
        )

        overall_score = self.calculate_overall_score(
            retry_risk,
            failure_risk,
            cascade_risk
        )

        risk_level = self.classify_risk(
            overall_score
        )

        risk_explanation = self.explain_risk(
            retry_risk,
            failure_risk,
            cascade_risk
        )

        return {
            "retry_risk": retry_risk,
            "failure_risk": failure_risk,
            "cascade_risk": cascade_risk,
            "overall_score": overall_score,
            "risk_level": risk_level,
            "risk_explanation": risk_explanation
        }
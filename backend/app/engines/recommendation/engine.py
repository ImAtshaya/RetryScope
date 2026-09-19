class RecommendationEngine:

    def __init__(self):
        pass

    def recommend_retry_configuration(
        self,
        retry_risk
    ):
        """
        Recommend a safer retry configuration
        based on retry risk.
        """

        if retry_risk <= 0:
            return {
                "recommendation": "No retry changes required.",
                "recommended_max_retries": None
            }

        if retry_risk <= 25:
            return {
                "recommendation": "Keep retries low.",
                "recommended_max_retries": 2
            }

        if retry_risk <= 50:
            return {
                "recommendation": "Reduce the number of retries.",
                "recommended_max_retries": 2
            }

        if retry_risk <= 75:
            return {
                "recommendation": "Strongly reduce retries to limit retry amplification.",
                "recommended_max_retries": 1
            }

        return {
            "recommendation": "Minimize retries to prevent severe retry amplification.",
            "recommended_max_retries": 1
        }
        
    def recommend_backoff_configuration(
        self,
        retry_risk
    ):
        """
        Recommend a safer backoff multiplier
        based on retry risk.
        """

        if retry_risk <= 0:
            return {
                "recommendation": "No backoff changes required.",
                "recommended_backoff_multiplier": 1
            }

        if retry_risk <= 25:
            return {
                "recommendation": "Use a small backoff multiplier.",
                "recommended_backoff_multiplier": 1.5
            }

        if retry_risk <= 50:
            return {
                "recommendation": "Use exponential backoff.",
                "recommended_backoff_multiplier": 2
            }

        if retry_risk <= 75:
            return {
                "recommendation": "Use stronger exponential backoff.",
                "recommended_backoff_multiplier": 2
            }

        return {
            "recommendation": "Use aggressive exponential backoff to reduce retry pressure.",
            "recommended_backoff_multiplier": 3
        }
        
        
    def recommend_jitter_configuration(
        self,
        retry_risk
    ):
        """
        Recommend whether jitter should be enabled
        based on retry risk.
        """

        if retry_risk <= 0:
            return {
                "recommendation": "Jitter is not required.",
                "recommended_jitter": False
            }

        if retry_risk <= 25:
            return {
                "recommendation": "Jitter is optional for low retry risk.",
                "recommended_jitter": False
            }

        if retry_risk <= 50:
            return {
                "recommendation": "Consider enabling jitter to spread retries.",
                "recommended_jitter": True
            }

        if retry_risk <= 75:
            return {
                "recommendation": "Enable jitter to reduce synchronized retries.",
                "recommended_jitter": True
            }

        return {
            "recommendation": "Enable jitter to strongly reduce retry synchronization.",
            "recommended_jitter": True
        }
        
    def recommend_failure_configuration(
        self,
        failure_risk,
        cascade_risk
    ):
        """
        Recommend safer failure-handling strategies
        based on failure and cascade risk.
        """

        recommendations = []

        # --------------------------------
        # Failure risk
        # --------------------------------

        if failure_risk >= 75:
            recommendations.append(
                "Enable circuit breaker to prevent repeated calls to failing services."
            )

        elif failure_risk >= 50:
            recommendations.append(
                "Improve failure handling and monitor service failure rates."
            )

        # --------------------------------
        # Cascade risk
        # --------------------------------

        if cascade_risk >= 75:
            recommendations.append(
                "Use circuit breakers and dependency isolation to prevent cascading failures."
            )

        elif cascade_risk >= 50:
            recommendations.append(
                "Consider dependency isolation to reduce cascading failure propagation."
            )

        # --------------------------------
        # No significant risk
        # --------------------------------

        if not recommendations:
            return {
                "recommendation": "No major failure-handling changes required.",
                "recommended_circuit_breaker": False,
                "recommended_dependency_isolation": False
            }

        # --------------------------------
        # Determine recommended protections
        # --------------------------------

        circuit_breaker = (
            failure_risk >= 75
            or cascade_risk >= 75
        )

        dependency_isolation = (
            cascade_risk >= 50
        )

        return {
            "recommendation": " ".join(recommendations),
            "recommended_circuit_breaker": circuit_breaker,
            "recommended_dependency_isolation": dependency_isolation
        }
        
        
    def recommend(self, risk_result):
        """
        Generate a complete safer configuration
        based on the risk assessment.
        """

        retry_risk = risk_result.get(
            "retry_risk",
            0
        )

        failure_risk = risk_result.get(
            "failure_risk",
            0
        )

        cascade_risk = risk_result.get(
            "cascade_risk",
            0
        )

        overall_score = risk_result.get(
            "overall_score",
            0
        )

        risk_level = risk_result.get(
            "risk_level",
            "LOW"
        )

        # --------------------------------
        # Individual recommendations
        # --------------------------------

        retry_recommendation = (
            self.recommend_retry_configuration(
                retry_risk
            )
        )

        backoff_recommendation = (
            self.recommend_backoff_configuration(
                retry_risk
            )
        )

        jitter_recommendation = (
            self.recommend_jitter_configuration(
                retry_risk
            )
        )

        failure_recommendation = (
            self.recommend_failure_configuration(
                failure_risk,
                cascade_risk
            )
        )

        # --------------------------------
        # Return complete recommendation
        # --------------------------------

        return {
            "risk_level": risk_level,
            "overall_score": overall_score,

            "retry": retry_recommendation,

            "backoff": backoff_recommendation,

            "jitter": jitter_recommendation,

            "failure_handling": failure_recommendation
        }       
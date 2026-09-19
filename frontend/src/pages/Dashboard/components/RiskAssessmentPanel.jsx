import Panel from './Panel'

function RiskAssessmentPanel({ simulation, risk }) {

  // ============================================
  // Risk score
  // ============================================

  const score =
    Number(
      risk?.overall_score ?? 0
    )


  // ============================================
  // Risk level
  // ============================================

  const level =
    risk?.risk_level ??
    (
      score >= 70
        ? 'HIGH'
        : score >= 40
        ? 'MODERATE'
        : 'LOW'
    )


  // ============================================
  // Simulation metrics
  // ============================================

  const totalRequests =
    Number(
      simulation?.total_requests ?? 0
    )


  const failedRequests =
    Number(
      simulation?.failed_requests ?? 0
    )


  const totalRetries =
    Number(
      simulation?.total_retries ?? 0
    )


  // ============================================
  // Failure rate
  // ============================================

  const failureRate =
    totalRequests > 0
      ? (
          failedRequests /
          totalRequests
        ) * 100
      : 0


  // ============================================
  // Retry amplification
  // ============================================

  const retryFactor =
    Number(
      simulation?.retry_amplification_factor ??
      (
        totalRequests > 0
          ? (
              totalRequests +
              totalRetries
            ) / totalRequests
          : 1
      )
    )


  // ============================================
  // Risk progress
  // ============================================

  const progressPercent =
    Math.min(
      100,
      Math.max(0, score)
    )


  // ============================================
  // Risk title
  // ============================================

  const title =
    level === 'HIGH'
      ? 'High Risk'
      : level === 'MODERATE'
        ? 'Moderate Risk'
        : 'Low Risk'


  // ============================================
  // Risk explanation
  // ============================================

  const description =
    risk?.risk_explanation ??
    'Risk calculated from the latest simulation.'


  return (

    <Panel
      className="risk-panel"
      eyebrow="Latest Analysis"
      title="Risk Assessment"
      action={
        <span className="risk-badge">
          {level}
        </span>
      }
    >

      <div className="risk-score">

        <div
          className="risk-score__circle"
          style={{
            '--risk-progress':
              `${progressPercent}%`
          }}
        >

          <strong>
            {score.toFixed(1)}
          </strong>

          <span>
            / 100
          </span>

        </div>


        <div className="risk-score__summary">

          <strong>
            {title}
          </strong>

          <p>
            {description}
          </p>

        </div>

      </div>


      <div
        className="risk-bar"
        aria-hidden="true"
      >

        <span
          style={{
            width:
              `${progressPercent}%`
          }}
        />

      </div>


      <div className="risk-panel__footer">

        <div className="risk-panel__stat">

          <span>
            Failure Rate
          </span>

          <strong>
            {failureRate.toFixed(1)}%
          </strong>

        </div>


        <div className="risk-panel__stat">

          <span>
            Retry Factor
          </span>

          <strong>
            {retryFactor.toFixed(2)}x
          </strong>

        </div>

      </div>

    </Panel>
  )
}

export default RiskAssessmentPanel
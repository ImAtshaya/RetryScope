import React from 'react';

function getRiskLevel(score) {
  if (score >= 70) {
    return {
      label: 'HIGH',
      color: 'high'
    };
  }

  if (score >= 30) {
    return {
      label: 'MODERATE',
      color: 'moderate'
    };
  }

  return {
    label: 'LOW',
    color: 'low'
  };
}

export function RiskBreakdown({ assessment }) {
  const categories = [
    {
      id: 'retry-risk',
      label: 'Retry Risk',
      score: Number(assessment.retryStormRisk ?? 0),
      desc: 'Risk caused by retry amplification in the simulation'
    },
    {
      id: 'failure-risk',
      label: 'Failure Risk',
      score: Number(assessment.failureRisk ?? 0),
      desc: 'Risk caused by request failures in the simulation'
    },
    {
      id: 'cascading-failure',
      label: 'Cascade Risk',
      score: Number(assessment.cascadingFailureRisk ?? 0),
      desc: 'Risk caused by cascading failure events'
    }
  ];

  return (
    <div className="rp-section">
      <div className="rp-section-heading">
        <h2 className="rp-section-title">Risk Breakdown</h2>
        <span className="rp-section-subtitle">
          Categorized vulnerability analysis
        </span>
      </div>

      <div className="rp-breakdown-grid">
        {categories.map((cat) => {
          const levelInfo = getRiskLevel(cat.score);
          const barColorClass =
            `rp-factor-bar-fill--${levelInfo.color}`;

          return (
            <div
              key={cat.id}
              className="rp-breakdown-card"
            >
              <div className="rp-breakdown-top">
                <span className="rp-breakdown-label">
                  {cat.label}
                </span>

                <span
                  className={`rp-factor-severity rp-factor-severity--${levelInfo.color}`}
                >
                  {levelInfo.label}
                </span>
              </div>

              <div className="rp-breakdown-score">
                <span className="rp-breakdown-score-val">
                  {cat.score}
                </span>

                <span className="rp-breakdown-score-max">
                  / 100
                </span>
              </div>

              <div className="rp-breakdown-progress-track">
                <div
                  className={`rp-breakdown-progress-fill ${barColorClass}`}
                  style={{
                    width: `${Math.min(
                      Math.max(cat.score, 0),
                      100
                    )}%`
                  }}
                />
              </div>

              <span className="rp-factor-desc">
                {cat.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

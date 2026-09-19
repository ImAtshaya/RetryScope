import React from 'react';


export function ComparisonCharts({
  scenarios
}) {

  // ==========================================================
  // SAFETY CHECK
  // ==========================================================

  if (!scenarios) {

    return (

      <div className="cmp-panel">

        <div className="cmp-panel__header">

          <span>
            Risk & Failure Rate Comparison
          </span>

          <span className="cmp-panel__header-tag">
            Severity
          </span>

        </div>


        <div className="cmp-panel__content">

          <p style={{ color: '#94a3b8' }}>
            Scenario data is not available yet.
          </p>

        </div>

      </div>

    );

  }


  // ==========================================================
  // METRICS
  // ==========================================================

  const baseline =
    scenarios.baseline?.metrics || {};

  const risky =
    scenarios.risky?.metrics || {};

  const recommended =
    scenarios.recommended?.metrics || {};


  const baselineRisk =
    Number(
      baseline.overallRisk
    ) || 0;


  const riskyRisk =
    Number(
      risky.overallRisk
    ) || 0;


  const recommendedRisk =
    Number(
      recommended.overallRisk
    ) || 0;


  const baselineFailure =
    Number(
      baseline.failureRateVal
    ) || 0;


  const riskyFailure =
    Number(
      risky.failureRateVal
    ) || 0;


  const recommendedFailure =
    Number(
      recommended.failureRateVal
    ) || 0;


  const failureRateMax =
    Math.max(
      30,
      baselineFailure,
      riskyFailure,
      recommendedFailure
    );


  return (

    <div className="cmp-panel">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="cmp-panel__header">

        <span>
          Risk & Failure Rate Comparison
        </span>

        <span className="cmp-panel__header-tag">
          Severity
        </span>

      </div>


      <div className="cmp-panel__content">

        {/* ==================================================
            OVERALL RISK
        ================================================== */}

        <div>

          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              marginBottom: 8
            }}
          >
            Overall Risk Comparison
          </div>


          <div className="cmp-bar-group">

            {/* BASELINE */}

            <div className="cmp-bar-row">

              <div className="cmp-bar-header">

                <span className="cmp-bar-name">
                  Baseline
                </span>

                <span
                  className="cmp-bar-val"
                  style={{ color: '#60a5fa' }}
                >
                  {baselineRisk.toFixed(2)}%
                </span>

              </div>


              <div className="cmp-bar-track">

                <div
                  className="cmp-bar-fill cmp-bar-fill--baseline"
                  style={{
                    width: `${Math.min(
                      baselineRisk,
                      100
                    )}%`
                  }}
                />

              </div>

            </div>


            {/* RISKY */}

            <div className="cmp-bar-row">

              <div className="cmp-bar-header">

                <span className="cmp-bar-name">
                  Risky Configuration
                </span>

                <span
                  className="cmp-bar-val"
                  style={{ color: '#f87171' }}
                >
                  {riskyRisk.toFixed(2)}%
                </span>

              </div>


              <div className="cmp-bar-track">

                <div
                  className="cmp-bar-fill cmp-bar-fill--risky"
                  style={{
                    width: `${Math.min(
                      riskyRisk,
                      100
                    )}%`
                  }}
                />

              </div>

            </div>


            {/* RECOMMENDED */}

            <div className="cmp-bar-row">

              <div className="cmp-bar-header">

                <span className="cmp-bar-name">
                  Recommended
                </span>

                <span
                  className="cmp-bar-val"
                  style={{ color: '#4ade80' }}
                >
                  {recommendedRisk.toFixed(2)}%
                </span>

              </div>


              <div className="cmp-bar-track">

                <div
                  className="cmp-bar-fill cmp-bar-fill--recommended"
                  style={{
                    width: `${Math.min(
                      recommendedRisk,
                      100
                    )}%`
                  }}
                />

              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            FAILURE RATE
        ================================================== */}

        <div style={{ marginTop: 12 }}>

          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              marginBottom: 8
            }}
          >
            Failure Rate Comparison
          </div>


          <div className="cmp-bar-group">

            {/* BASELINE */}

            <div className="cmp-bar-row">

              <div className="cmp-bar-header">

                <span className="cmp-bar-name">
                  Baseline
                </span>

                <span
                  className="cmp-bar-val"
                  style={{ color: '#60a5fa' }}
                >
                  {baselineFailure.toFixed(1)}%
                </span>

              </div>


              <div className="cmp-bar-track">

                <div
                  className="cmp-bar-fill cmp-bar-fill--baseline"
                  style={{
                    width: `${Math.min(
                      (
                        baselineFailure /
                        failureRateMax
                      ) * 100,
                      100
                    )}%`
                  }}
                />

              </div>

            </div>


            {/* RISKY */}

            <div className="cmp-bar-row">

              <div className="cmp-bar-header">

                <span className="cmp-bar-name">
                  Risky Configuration
                </span>

                <span
                  className="cmp-bar-val"
                  style={{ color: '#f87171' }}
                >
                  {riskyFailure.toFixed(1)}%
                </span>

              </div>


              <div className="cmp-bar-track">

                <div
                  className="cmp-bar-fill cmp-bar-fill--risky"
                  style={{
                    width: `${Math.min(
                      (
                        riskyFailure /
                        failureRateMax
                      ) * 100,
                      100
                    )}%`
                  }}
                />

              </div>

            </div>


            {/* RECOMMENDED */}

            <div className="cmp-bar-row">

              <div className="cmp-bar-header">

                <span className="cmp-bar-name">
                  Recommended
                </span>

                <span
                  className="cmp-bar-val"
                  style={{ color: '#4ade80' }}
                >
                  {recommendedFailure.toFixed(1)}%
                </span>

              </div>


              <div className="cmp-bar-track">

                <div
                  className="cmp-bar-fill cmp-bar-fill--recommended"
                  style={{
                    width: `${Math.min(
                      (
                        recommendedFailure /
                        failureRateMax
                      ) * 100,
                      100
                    )}%`
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
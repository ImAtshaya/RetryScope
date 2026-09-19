import React from 'react';


export function RetryComparison({
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
            Retry Amplification Comparison
          </span>

          <span className="cmp-panel__header-tag">
            Load Multiplier
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


  // ==========================================================
  // AMPLIFICATION
  // ==========================================================

  const baselineAmp =
    Number(
      baseline.retryAmplificationVal
    ) || 1;


  const riskyAmp =
    Number(
      risky.retryAmplificationVal
    ) || 1;


  const recommendedAmp =
    Number(
      recommended.retryAmplificationVal
    ) || 1;


  const maxAmp =
    Math.max(
      3.5,
      baselineAmp,
      riskyAmp,
      recommendedAmp
    );


  const getWidth = (
    value
  ) => {

    return Math.min(
      100,
      Math.max(
        0,
        (
          value /
          maxAmp
        ) * 100
      )
    );

  };


  // ==========================================================
  // RETRY ATTEMPTS
  // ==========================================================

  const baselineRetries =
    Number(
      baseline.retryAttempts
    ) || 0;


  const riskyRetries =
    Number(
      risky.retryAttempts
    ) || 0;


  const recommendedRetries =
    Number(
      recommended.retryAttempts
    ) || 0;


  // ==========================================================
  // CONFIGURATION LABELS
  // ==========================================================

  const baselineRetriesConfig =
    scenarios.baseline?.configuration
      ?.maxRetries ||
    'Baseline Policy';


  const riskyRetriesConfig =
    scenarios.risky?.configuration
      ?.maxRetries ||
    'Risky Policy';


  const recommendedRetriesConfig =
    scenarios.recommended?.configuration
      ?.maxRetries ||
    'Recommended Policy';


  const baselineBackoff =
    scenarios.baseline?.configuration
      ?.backoffStrategy ||
    'Exponential';


  const riskyBackoff =
    scenarios.risky?.configuration
      ?.backoffStrategy ||
    'Fixed';


  const recommendedBackoff =
    scenarios.recommended?.configuration
      ?.backoffStrategy ||
    'Exponential + Jitter';


  return (

    <div className="cmp-panel">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="cmp-panel__header">

        <span>
          Retry Amplification Comparison
        </span>

        <span className="cmp-panel__header-tag">
          Load Multiplier
        </span>

      </div>


      <div className="cmp-panel__content">

        <div className="cmp-bar-group">

          {/* =================================================
              BASELINE
          ================================================= */}

          <div className="cmp-bar-row">

            <div className="cmp-bar-header">

              <span className="cmp-bar-name">

                {`Baseline Policy (${baselineRetriesConfig})`}

              </span>

              <span
                className="cmp-bar-val"
                style={{
                  color: '#60a5fa'
                }}
              >
                {baselineAmp.toFixed(3)}x
              </span>

            </div>


            <div
              className="cmp-bar-track"
              style={{
                height: 10
              }}
            >

              <div
                className="cmp-bar-fill cmp-bar-fill--baseline"
                style={{
                  width: `${getWidth(
                    baselineAmp
                  )}%`
                }}
              />

            </div>


            <span
              style={{
                fontSize: '0.6875rem',
                color: '#64748b'
              }}
            >

              Adds{' '}
              {baselineRetries.toLocaleString()}
              {' '}
              retry calls to downstream queues.

            </span>

          </div>


          {/* =================================================
              RISKY
          ================================================= */}

          <div
            className="cmp-bar-row"
            style={{
              marginTop: 8
            }}
          >

            <div className="cmp-bar-header">

              <span className="cmp-bar-name">

                {`Risky Policy (${riskyRetriesConfig}, ${riskyBackoff})`}

              </span>

              <span
                className="cmp-bar-val"
                style={{
                  color: '#f87171'
                }}
              >
                {riskyAmp.toFixed(3)}x
              </span>

            </div>


            <div
              className="cmp-bar-track"
              style={{
                height: 10
              }}
            >

              <div
                className="cmp-bar-fill cmp-bar-fill--risky"
                style={{
                  width: `${getWidth(
                    riskyAmp
                  )}%`
                }}
              />

            </div>


            <span
              style={{
                fontSize: '0.6875rem',
                color: '#f87171'
              }}
            >

              {riskyRetries >
              baselineRetries

                ? `Higher retry pressure with ${riskyRetries.toLocaleString()} retry attempts.`

                : `Retry attempts: ${riskyRetries.toLocaleString()}.`
              }

            </span>

          </div>


          {/* =================================================
              RECOMMENDED
          ================================================= */}

          <div
            className="cmp-bar-row"
            style={{
              marginTop: 8
            }}
          >

            <div className="cmp-bar-header">

              <span className="cmp-bar-name">

                {`Recommended Policy (${recommendedRetriesConfig}, ${recommendedBackoff})`}

              </span>

              <span
                className="cmp-bar-val"
                style={{
                  color: '#4ade80'
                }}
              >
                {recommendedAmp.toFixed(3)}x
              </span>

            </div>


            <div
              className="cmp-bar-track"
              style={{
                height: 10
              }}
            >

              <div
                className="cmp-bar-fill cmp-bar-fill--recommended"
                style={{
                  width: `${getWidth(
                    recommendedAmp
                  )}%`
                }}
              />

            </div>


            <span
              style={{
                fontSize: '0.6875rem',
                color: '#4ade80'
              }}
            >

              Controlled{' '}
              {recommendedRetries.toLocaleString()}
              {' '}
              retry attempts with lower downstream pressure.

            </span>

          </div>

        </div>

      </div>

    </div>

  );

}
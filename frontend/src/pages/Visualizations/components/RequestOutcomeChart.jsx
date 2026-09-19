import React from 'react';

export function RequestOutcomeChart({ outcomes = {} }) {
  const successful = outcomes.successful || {
    count: 0,
    percent: 0
  };

  const retried = outcomes.retried || {
    count: 0,
    percent: 0
  };

  const failed = outcomes.failed || {
    count: 0,
    percent: 0
  };

  return (
    <div className="viz-panel">

      <div className="viz-panel__header">
        <span>
          Request Outcome Distribution
        </span>

        <span className="viz-panel__header-tag">
          Throughput
        </span>
      </div>


      <div className="viz-panel__content">

        {/* Multi-segment Progress Bar */}

        <div className="viz-outcome-bar">

          <div
            className="viz-outcome-segment viz-outcome-segment--success"
            style={{
              width: `${successful.percent}%`
            }}
            title={
              `Successful: ${successful.percent}%`
            }
          />

          <div
            className="viz-outcome-segment viz-outcome-segment--retried"
            style={{
              width: `${retried.percent}%`
            }}
            title={
              `Retried: ${retried.percent}%`
            }
          />

          <div
            className="viz-outcome-segment viz-outcome-segment--failed"
            style={{
              width: `${failed.percent}%`
            }}
            title={
              `Failed: ${failed.percent}%`
            }
          />

        </div>


        {/* Outcome Breakdown */}

        <div className="viz-outcome-list">


          {/* Successful */}

          <div className="viz-outcome-row">

            <div
              className="viz-outcome-label-group"
            >

              <div
                className="viz-outcome-dot"
                style={{
                  background: '#22c55e'
                }}
              />

              <span>
                Successful Requests
              </span>

            </div>


            <div>

              <span
                className="viz-outcome-count"
              >
                {Number(
                  successful.count || 0
                ).toLocaleString()} calls
              </span>


              <span
                className="viz-outcome-pct"
                style={{
                  marginLeft: 12,
                  color: '#4ade80'
                }}
              >
                {successful.percent}%
              </span>

            </div>

          </div>


          {/* Retried */}

          <div className="viz-outcome-row">

            <div
              className="viz-outcome-label-group"
            >

              <div
                className="viz-outcome-dot"
                style={{
                  background: '#f59e0b'
                }}
              />

              <span>
                Retried Requests
              </span>

            </div>


            <div>

              <span
                className="viz-outcome-count"
              >
                {Number(
                  retried.count || 0
                ).toLocaleString()} calls
              </span>


              <span
                className="viz-outcome-pct"
                style={{
                  marginLeft: 12,
                  color: '#fbbf24'
                }}
              >
                {retried.percent}%
              </span>

            </div>

          </div>


          {/* Failed */}

          <div className="viz-outcome-row">

            <div
              className="viz-outcome-label-group"
            >

              <div
                className="viz-outcome-dot"
                style={{
                  background: '#ef4444'
                }}
              />

              <span>
                Failed Requests (Dropped)
              </span>

            </div>


            <div>

              <span
                className="viz-outcome-count"
              >
                {Number(
                  failed.count || 0
                ).toLocaleString()} calls
              </span>


              <span
                className="viz-outcome-pct"
                style={{
                  marginLeft: 12,
                  color: '#f87171'
                }}
              >
                {failed.percent}%
              </span>

            </div>

          </div>


        </div>

      </div>

    </div>
  );
}
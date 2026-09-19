import React from 'react';

export function RiskInputs({ inputs, simulation, onChange }) {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="rp-panel">
      <div className="rp-panel__header">
        <span>Risk Inputs</span>
        <span className="rp-panel__header-tag">Parameters</span>
      </div>

      <div className="rp-panel__content">

        {/* Downstream Failure Rate - Backend Simulation */}
        <div className="rp-group">
          <label className="rp-label">
            <span>Downstream Failure Rate</span>
            <span className="rp-label__value">
              {Number(
                simulation?.configured_failure_rate ??
                inputs.failureRate ??
                0
              )}%
            </span>
          </label>

          <span className="rp-help-text">
            Baseline service failure percentage
          </span>
        </div>

        {/* Maximum Retries - Backend Simulation */}
        <div className="rp-group">
          <label className="rp-label">
            <span>Maximum Retries</span>
            <span className="rp-label__value">
              {Number(
                simulation?.max_retries ??
                inputs.maxRetries ??
                0
              )}
            </span>
          </label>

          <span className="rp-help-text">
            Max retry attempts per failed call
          </span>
        </div>

        {/* Retry Amplification - Backend Result */}
        <div className="rp-group">
          <label className="rp-label">
            <span>Retry Amplification</span>

            <span className="rp-label__value">
              {Number(
                simulation?.retry_amplification_factor ?? 1
              ).toFixed(2)}x
            </span>
          </label>

          <span className="rp-help-text">
            Observed traffic multiplier from retries
          </span>
        </div>

        {/* Request Timeout - Backend Simulation */}
        <div className="rp-group">
          <label className="rp-label">
            <span>Request Timeout</span>
            <span className="rp-label__value">
              {Number(
                simulation?.timeout ??
                inputs.timeout ??
                0
              )} ms
            </span>
          </label>

          <span className="rp-help-text">
            Client threshold before giving up on response
          </span>
        </div>

        {/* Backoff Strategy - Backend Simulation */}
        <div className="rp-group">
          <label className="rp-label">
            <span>Backoff Strategy</span>

            <span
              className="rp-label__value"
              style={{ textTransform: 'capitalize' }}
            >
              {simulation?.backoff ??
                inputs.backoffStrategy ??
                'exponential'}
            </span>
          </label>

          <span className="rp-help-text">
            Spacing algorithm between retries
          </span>
        </div>

        {/* Dependency Chain Length */}
        <div className="rp-group">
          <label className="rp-label" htmlFor="rp-service-count">
            <span>Dependency Chain Length</span>

            <span className="rp-label__value">
              {inputs.serviceCount} services
            </span>
          </label>

          <input
            id="rp-service-count"
            type="number"
            className="rp-input"
            min="1"
            max="15"
            value={inputs.serviceCount}
            onChange={(e) =>
              handleChange(
                'serviceCount',
                Math.min(
                  15,
                  Math.max(
                    1,
                    Number(e.target.value)
                  )
                )
              )
            }
          />

          <span className="rp-help-text">
            Number of chained microservice dependencies
          </span>
        </div>

      </div>
    </div>
  );
}


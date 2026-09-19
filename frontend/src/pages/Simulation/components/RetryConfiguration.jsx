import React from 'react';

export function RetryConfiguration({ config, onChange, isRunning }) {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="sim-panel">
      <div className="sim-panel__header">
        <span>Retry Behaviour</span>
        <span className="sim-panel__header-tag">Policy</span>
      </div>
      <div className="sim-panel__content">
        <div className="sim-group">
          <label className="sim-label" htmlFor="sim-max-retries">
            <span>Maximum Retries</span>
            <span className="sim-label__value">{config.maxRetries}</span>
          </label>
          <input
            id="sim-max-retries"
            type="number"
            className="sim-input"
            min="0"
            max="10"
            value={config.maxRetries}
            disabled={isRunning}
            onChange={(e) =>
              handleChange('maxRetries', Math.min(10, Math.max(0, Number(e.target.value))))
            }
          />
          <span className="sim-help-text">Max retry attempts per failed request (0–10)</span>
        </div>

        <div className="sim-group">
          <label className="sim-label" htmlFor="sim-backoff">
            <span>Retry Backoff Strategy</span>
            <span className="sim-label__value" style={{ textTransform: 'capitalize' }}>
              {config.backoff}
            </span>
          </label>
          <select
            id="sim-backoff"
            className="sim-select"
            value={config.backoff}
            disabled={isRunning}
            onChange={(e) => handleChange('backoff', e.target.value)}
          >
            <option value="exponential">Exponential Backoff (Recommended)</option>
            <option value="fixed">Fixed Delay</option>
          </select>
          <span className="sim-help-text">Algorithm for computing successive retry intervals</span>
        </div>

        <div className="sim-group">
          <label className="sim-label" htmlFor="sim-retry-delay">
            <span>Initial Retry Delay</span>
            <span className="sim-label__value">{config.retryDelay} ms</span>
          </label>
          <input
            id="sim-retry-delay"
            type="number"
            className="sim-input"
            min="10"
            max="10000"
            step="50"
            value={config.retryDelay}
            disabled={isRunning}
            onChange={(e) => handleChange('retryDelay', Math.max(10, Number(e.target.value)))}
          />
          <span className="sim-help-text">Base wait interval before the first retry attempt</span>
        </div>

        <div className="sim-group">
          <label className="sim-label" htmlFor="sim-timeout">
            <span>Request Timeout</span>
            <span className="sim-label__value">{config.timeout} ms</span>
          </label>
          <input
            id="sim-timeout"
            type="number"
            className="sim-input"
            min="100"
            max="30000"
            step="100"
            value={config.timeout}
            disabled={isRunning}
            onChange={(e) => handleChange('timeout', Math.max(100, Number(e.target.value)))}
          />
          <span className="sim-help-text">Client threshold before marking request as timed out</span>
        </div>
      </div>
    </div>
  );
}

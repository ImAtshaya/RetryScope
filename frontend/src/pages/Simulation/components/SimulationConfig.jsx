import React from 'react';

export function SimulationConfig({ config, onChange, isRunning }) {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="sim-panel">
      <div className="sim-panel__header">
        <span>Simulation Configuration</span>
        <span className="sim-panel__header-tag">Workload</span>
      </div>
      <div className="sim-panel__content">
        <div className="sim-group">
          <label className="sim-label" htmlFor="sim-users">
            <span>Virtual Users</span>
            <span className="sim-label__value">{config.users}</span>
          </label>
          <select
            id="sim-users"
            className="sim-select"
            value={config.users}
            disabled={isRunning}
            onChange={(e) => handleChange('users', Number(e.target.value))}
          >
            <option value={10}>10 Users (Light load)</option>
            <option value={50}>50 Users (Moderate load)</option>
            <option value={100}>100 Users (Standard)</option>
            <option value={500}>500 Users (Heavy stress)</option>
            <option value={1000}>1,000 Users (Peak storm)</option>
          </select>
          <span className="sim-help-text">Simulated concurrent client instances</span>
        </div>

        <div className="sim-group">
          <label className="sim-label" htmlFor="sim-requests">
            <span>Requests per User</span>
            <span className="sim-label__value">{config.requestsPerUser}</span>
          </label>
          <input
            id="sim-requests"
            type="number"
            className="sim-input"
            min="1"
            max="1000"
            value={config.requestsPerUser}
            disabled={isRunning}
            onChange={(e) => handleChange('requestsPerUser', Math.max(1, Number(e.target.value)))}
          />
          <span className="sim-help-text">Initial requests issued per virtual client</span>
        </div>

        <div className="sim-group">
          <label className="sim-label" htmlFor="sim-duration">
            <span>Simulation Duration</span>
            <span className="sim-label__value">{config.duration}s</span>
          </label>
          <select
            id="sim-duration"
            className="sim-select"
            value={config.duration}
            disabled={isRunning}
            onChange={(e) => handleChange('duration', Number(e.target.value))}
          >
            <option value={10}>10 seconds</option>
            <option value={30}>30 seconds (Default)</option>
            <option value={60}>60 seconds (1 minute)</option>
            <option value={120}>120 seconds (2 minutes)</option>
          </select>
          <span className="sim-help-text">Workload execution window length</span>
        </div>

        <div className="sim-group">
          <label className="sim-label" htmlFor="sim-failure-rate">
            <span>Downstream Failure Rate</span>
            <span className="sim-label__value">{config.failureRate}%</span>
          </label>
          <input
            id="sim-failure-rate"
            type="range"
            className="sim-range"
            min="0"
            max="100"
            step="1"
            value={config.failureRate}
            disabled={isRunning}
            onChange={(e) => handleChange('failureRate', Number(e.target.value))}
          />
          <span className="sim-help-text">Baseline percentage of requests that encounter failure</span>
        </div>
      </div>
    </div>
  );
}

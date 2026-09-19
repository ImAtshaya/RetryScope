import React from 'react';

export function SimulationMetrics({ results, isRunning }) {
  const totalRequests = results?.total_requests ?? 0;
  const successfulRequests = results?.successful_requests ?? 0;
  const failedRequests = results?.failed_requests ?? 0;
  const totalRetries = results?.total_retries ?? 0;
  const duration = results?.duration ?? 0;

  const amplification =
    results?.retry_amplification_factor ??
    (totalRequests > 0
      ? ((totalRequests + totalRetries) / totalRequests).toFixed(2)
      : '1.00');

  const successPercent =
    totalRequests > 0
      ? ((successfulRequests / totalRequests) * 100).toFixed(1)
      : '0.0';

  const failurePercent =
    totalRequests > 0
      ? ((failedRequests / totalRequests) * 100).toFixed(1)
      : '0.0';

  const metrics = [
    {
      label: 'Total Requests',
      value: totalRequests.toLocaleString(),
      subtext: results ? `${duration}s window` : 'Not run',
      valueClass: ''
    },
    {
      label: 'Successful',
      value: successfulRequests.toLocaleString(),
      subtext: results ? `${successPercent}% completed` : '0%',
      valueClass: 'sim-metric-card__value--success'
    },
    {
      label: 'Failed',
      value: failedRequests.toLocaleString(),
      subtext: results ? `${failurePercent}% dropped` : '0%',
      valueClass:
        failedRequests > 0
          ? 'sim-metric-card__value--danger'
          : ''
    },
    {
      label: 'Total Retries',
      value: totalRetries.toLocaleString(),
      subtext: results ? 'Re-attempted calls' : '0 retries',
      valueClass:
        totalRetries > 0
          ? 'sim-metric-card__value--warning'
          : ''
    },
    {
      label: 'Amplification',
      value: `${Number(amplification).toFixed(2)}x`,
      subtext: results ? 'Traffic multiplier' : 'Baseline factor',
      valueClass:
        Number(amplification) > 1.25
          ? 'sim-metric-card__value--danger'
          : 'sim-metric-card__value--accent'
    }
  ];

  return (
    <div className="sim-metrics-grid">
      {metrics.map((metric, i) => (
        <div key={i} className="sim-metric-card">
          <div className="sim-metric-card__header">
            <span className="sim-metric-card__label">
              {metric.label}
            </span>
          </div>

          <span
            className={`sim-metric-card__value ${metric.valueClass}`}
          >
            {isRunning ? '...' : metric.value}
          </span>

          <span className="sim-metric-card__subtext">
            {metric.subtext}
          </span>
        </div>
      ))}
    </div>
  );
}
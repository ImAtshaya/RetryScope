import React from 'react';

export function SummaryMetrics({ summary }) {
  const metrics = [
    {
      label: 'Total Requests',
      value: summary.totalRequests.toLocaleString(),
      subtext: 'In selected window',
      valueClass: ''
    },
    {
      label: 'Failed Requests',
      value: summary.failedRequests.toLocaleString(),
      subtext: `${((summary.failedRequests / summary.totalRequests) * 100).toFixed(1)}% drop rate`,
      valueClass: 'viz-summary-card__value--danger'
    },
    {
      label: 'Retry Attempts',
      value: summary.retryAttempts.toLocaleString(),
      subtext: 'Re-dispatched calls',
      valueClass: 'viz-summary-card__value--warning'
    },
    {
      label: 'Retry Amplification',
      value: summary.retryAmplification,
      subtext: 'Peak traffic factor',
      valueClass: 'viz-summary-card__value--accent'
    },
    {
      label: 'Overall Risk',
      value: `${summary.overallRisk}%`,
      subtext: `${summary.riskLevel} severity`,
      valueClass: summary.overallRisk > 50 ? 'viz-summary-card__value--danger' : 'viz-summary-card__value--warning'
    }
  ];

  return (
    <div className="viz-summary-grid">
      {metrics.map((m, i) => (
        <div key={i} className="viz-summary-card">
          <div className="viz-summary-card__header">
            <span className="viz-summary-card__label">{m.label}</span>
          </div>
          <span className={`viz-summary-card__value ${m.valueClass}`}>{m.value}</span>
          <span className="viz-summary-card__subtext">{m.subtext}</span>
        </div>
      ))}
    </div>
  );
}

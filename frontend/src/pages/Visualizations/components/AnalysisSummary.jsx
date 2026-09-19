import React from 'react';

export function AnalysisSummary({ summary }) {
  return (
    <div className="viz-panel viz-panel--full">
      <div className="viz-panel__header">
        <span>Analysis Summary & Engineering Insights</span>
        <span className="viz-panel__header-tag">Executive Summary</span>
      </div>
      <div className="viz-panel__content">
        <div className="viz-summary-box">
          <p className="viz-summary-text">{summary.narrative}</p>

          <div className="viz-summary-highlights">
            <div className="viz-summary-highlight-item">
              <span className="viz-summary-highlight-label">Primary Bottleneck</span>
              <span className="viz-summary-highlight-value viz-summary-highlight-value--warning">
                {summary.mostAffected}
              </span>
            </div>

            <div className="viz-summary-highlight-item">
              <span className="viz-summary-highlight-label">Peak Retry Multiplier</span>
              <span className="viz-summary-highlight-value viz-summary-highlight-value--accent">
                {summary.highestAmplification}
              </span>
            </div>

            <div className="viz-summary-highlight-item">
              <span className="viz-summary-highlight-label">Aggregate System Risk</span>
              <span className="viz-summary-highlight-value">{summary.overallRiskStatus}</span>
            </div>

            <div className="viz-summary-highlight-item">
              <span className="viz-summary-highlight-label">Mitigation Priority</span>
              <span className="viz-summary-highlight-value" style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>
                {summary.recommendation}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

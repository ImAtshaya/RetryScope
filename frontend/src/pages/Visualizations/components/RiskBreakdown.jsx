import React from 'react';

export function RiskBreakdown({ riskBreakdown }) {
  return (
    <div className="viz-panel">
      <div className="viz-panel__header">
        <span>Risk Breakdown Overview</span>
        <span className="viz-panel__header-tag">Threat Categories</span>
      </div>
      <div className="viz-panel__content">
        <div className="viz-risk-list">
          {riskBreakdown.map((item) => {
            const levelClass = item.level.toLowerCase();

            return (
              <div key={item.label} className="viz-risk-row">
                <div className="viz-risk-header">
                  <span className="viz-risk-title">{item.label}</span>
                  <span className={`viz-risk-badge viz-risk-badge--${levelClass}`}>
                    {item.level} ({item.score}%)
                  </span>
                </div>

                <div className="viz-risk-track">
                  <div
                    className={`viz-risk-fill viz-risk-fill--${levelClass}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <div className="viz-risk-footer">
                  <span>{item.description}</span>
                  <strong style={{ color: '#f1f5f9' }}>{item.score} / 100</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

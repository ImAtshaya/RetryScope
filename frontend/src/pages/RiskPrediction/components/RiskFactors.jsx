import React from 'react';

export function RiskFactors({ factors }) {
  return (
    <div className="rp-panel">
      <div className="rp-panel__header">
        <span>Contributing Risk Factors</span>
        <span className="rp-panel__header-tag">Drivers</span>
      </div>
      <div className="rp-panel__content">
        <div className="rp-factors-list">
          {factors.map((factor) => {
            const severityClass = `rp-factor-severity--${factor.value.toLowerCase()}`;
            const fillClass = `rp-factor-bar-fill--${factor.value.toLowerCase()}`;

            return (
              <div key={factor.id} className="rp-factor-item">
                <div className="rp-factor-header">
                  <span className="rp-factor-name">{factor.name}</span>
                  <span className={`rp-factor-severity ${severityClass}`}>
                    {factor.value}
                  </span>
                </div>
                <div className="rp-factor-bar-track">
                  <div
                    className={`rp-factor-bar-fill ${fillClass}`}
                    style={{ width: `${Math.min(100, Math.max(5, factor.percent))}%` }}
                  />
                </div>
                <span className="rp-factor-desc">{factor.description}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

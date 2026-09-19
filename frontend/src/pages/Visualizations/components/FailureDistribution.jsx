import React from 'react';

export function FailureDistribution({ serviceFailures }) {
  return (
    <div className="viz-panel">
      <div className="viz-panel__header">
        <span>Service Failure Distribution</span>
        <span className="viz-panel__header-tag">Localization</span>
      </div>
      <div className="viz-panel__content">
        <div className="viz-dist-list">
          {serviceFailures.map((svc) => {
            const isWarning = svc.status === 'Warning' || svc.isHighest;

            return (
              <div
                key={svc.service}
                className={`viz-dist-item ${svc.isHighest || svc.isHighlighted ? 'viz-dist-item--highlight' : ''}`}
              >
                <div className="viz-dist-header">
                  <span className="viz-dist-name">
                    {svc.service} {svc.isHighest && <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>(Primary Bottleneck)</span>}
                  </span>
                  <span
                    className={`viz-dist-badge ${isWarning ? 'viz-dist-badge--warning' : 'viz-dist-badge--healthy'}`}
                  >
                    ● {svc.status}
                  </span>
                </div>

                <div className="viz-dist-track">
                  <div
                    className={`viz-dist-fill ${isWarning ? 'viz-dist-fill--warning' : ''}`}
                    style={{ width: `${svc.percent}%` }}
                  />
                </div>

                <div className="viz-dist-sub">
                  <span>{svc.failures.toLocaleString()} errors encountered</span>
                  <strong style={{ color: '#f1f5f9' }}>{svc.percent}%</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

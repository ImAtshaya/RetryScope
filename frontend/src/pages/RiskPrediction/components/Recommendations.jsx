import React from 'react';

export function Recommendations({ recommendations }) {
  return (
    <div className="rp-section">
      <div className="rp-section-heading">
        <h2 className="rp-section-title">Recommended Actions</h2>
        <span className="rp-section-subtitle">Mitigation strategies to reduce retry storm hazards</span>
      </div>

      <div className="rp-recommendations-grid">
        {recommendations.map((rec) => {
          const priorityClass = `rp-rec-priority--${rec.priorityLevel || 'medium'}`;

          return (
            <div key={rec.id} className="rp-rec-card">
              <div className="rp-rec-header">
                <span className="rp-rec-title">{rec.title}</span>
                <span className={`rp-rec-priority ${priorityClass}`}>{rec.priority}</span>
              </div>

              <div className="rp-rec-details">
                <div className="rp-rec-col">
                  <span className="rp-rec-col-label">Current Configuration</span>
                  <span className="rp-rec-col-value">{rec.current}</span>
                </div>
                <div className="rp-rec-col">
                  <span className="rp-rec-col-label">Recommended Target</span>
                  <span className="rp-rec-col-value rp-rec-col-value--highlight">
                    {rec.recommended}
                  </span>
                </div>
              </div>

              <p className="rp-rec-desc">{rec.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

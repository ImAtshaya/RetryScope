import React from 'react';

export function FaultSummary({ targetName, faultName, duration, status }) {
  let statusClass = 'fi-summary-status--ready';
  if (status === 'Configured') statusClass = 'fi-summary-status--configured';
  if (status === 'Invalid') statusClass = 'fi-summary-status--invalid';

  return (
    <div className="fi-summary">
      <div className="fi-summary-title">Fault Summary</div>
      <div className="fi-summary-row">
        <span className="fi-summary-label">Target</span>
        <span className="fi-summary-value">{targetName || 'None'}</span>
      </div>
      <div className="fi-summary-row">
        <span className="fi-summary-label">Fault</span>
        <span className="fi-summary-value">{faultName || 'None'}</span>
      </div>
      {duration && (
        <div className="fi-summary-row">
          <span className="fi-summary-label">Duration</span>
          <span className="fi-summary-value">{duration}</span>
        </div>
      )}
      <div className="fi-summary-row" style={{ marginTop: '8px' }}>
        <span className="fi-summary-label">Status</span>
        <span className={`fi-summary-status ${statusClass}`}>{status}</span>
      </div>
    </div>
  );
}

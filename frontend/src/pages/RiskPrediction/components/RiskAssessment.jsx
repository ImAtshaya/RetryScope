import React from 'react';
import { RiskGauge } from './RiskGauge';

export function RiskAssessment({ assessment }) {
  return (
    <div className="rp-panel rp-assessment-panel-wrapper">
      <div className="rp-panel__header">
        <span>Overall Risk Assessment</span>
        <span className="rp-panel__header-tag">Prediction</span>
      </div>
      <div className="rp-panel__content rp-assessment-panel">
        <RiskGauge score={assessment.score} />

        <div className={`rp-level-badge ${assessment.badgeClass}`}>
          ● {assessment.level} RISK
        </div>

        <p className="rp-assessment-explanation">{assessment.explanation}</p>
      </div>
    </div>
  );
}

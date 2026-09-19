import React from 'react';

export function RiskGauge({ score }) {
  // Semicircle arc calculation (radius 80, stroke 14)
  // Arc length for semicircle of radius 80 = PI * 80 = 251.327
  const radius = 80;
  const circumference = Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#22c55e'; // low
  if (clampedScore >= 75) strokeColor = '#ef4444'; // critical
  else if (clampedScore >= 50) strokeColor = '#f97316'; // high
  else if (clampedScore >= 25) strokeColor = '#f59e0b'; // moderate

  return (
    <div className="rp-gauge-wrapper">
      <svg className="rp-gauge-svg" viewBox="0 0 200 110">
        {/* Background track arc */}
        <path
          className="rp-gauge-bg-arc"
          d="M 20 100 A 80 80 0 0 1 180 100"
        />
        {/* Dynamic colored progress arc */}
        <path
          className="rp-gauge-fill-arc"
          d="M 20 100 A 80 80 0 0 1 180 100"
          style={{
            stroke: strokeColor,
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset
          }}
        />
      </svg>
      <div className="rp-gauge-score-container">
        <span className="rp-gauge-score-value">{clampedScore}</span>
        <span className="rp-gauge-score-max">/ 100</span>
      </div>
    </div>
  );
}

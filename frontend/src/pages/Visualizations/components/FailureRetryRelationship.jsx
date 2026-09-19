import React from 'react';

export function FailureRetryRelationship({ points }) {
  const width = 460;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // X: Failure Rate (0% - 70%)
  const minX = 0;
  const maxX = 70;
  // Y: Retries (1 - 7)
  const minY = 1;
  const maxY = 7;

  const plotPoints = points.map((pt) => {
    const x = paddingLeft + ((pt.failureRate - minX) / (maxX - minX)) * chartWidth;
    const y = paddingTop + chartHeight - ((pt.retries - minY) / (maxY - minY)) * chartHeight;
    return { x, y, ...pt };
  });

  const polylineStr = plotPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="viz-panel">
      <div className="viz-panel__header">
        <span>Failure Rate vs. Retry Multiplier</span>
        <span className="viz-panel__header-tag">Correlation</span>
      </div>
      <div className="viz-panel__content">
        <svg className="viz-chart-svg" viewBox={`0 0 ${width} ${height}`}>
          {/* Y-axis grid & labels */}
          {[1, 3, 5, 7].map((val) => {
            const y = paddingTop + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  className="viz-chart-grid"
                />
                <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="viz-chart-text">
                  {val}x
                </text>
              </g>
            );
          })}

          {/* Trendline */}
          <polyline
            points={polylineStr}
            style={{
              fill: 'none',
              stroke: '#60a5fa',
              strokeWidth: 2,
              strokeDasharray: '4, 4'
            }}
          />

          {/* Points */}
          {plotPoints.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={5}
                style={{
                  fill: '#f59e0b',
                  stroke: '#0d1219',
                  strokeWidth: 2,
                  cursor: 'pointer'
                }}
              >
                <title>{`${p.label}: ${p.failureRate}% failure -> ${p.retries}x retries`}</title>
              </circle>
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                style={{ fill: '#94a3b8', fontSize: '9px', fontWeight: 600 }}
              >
                {p.failureRate}%
              </text>
            </g>
          ))}

          {/* X Axis label */}
          <text
            x={paddingLeft + chartWidth / 2}
            y={height - 6}
            textAnchor="middle"
            className="viz-chart-text"
          >
            Downstream Failure Rate (%)
          </text>
        </svg>
      </div>
    </div>
  );
}

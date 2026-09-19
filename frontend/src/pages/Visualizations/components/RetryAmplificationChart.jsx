import React from 'react';

export function RetryAmplificationChart({ timeline = [] }) {
  // ==================================================
  // Chart dimensions
  // ==================================================

  const width = 460;
  const height = 180;

  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth =
    width - paddingLeft - paddingRight;

  const chartHeight =
    height - paddingTop - paddingBottom;

  // ==================================================
  // Safe timeline
  // ==================================================

  const safeTimeline = Array.isArray(timeline)
    ? timeline
        .map((item) => ({
          time: item?.time || 'Current Run',
          value: Number(item?.value),
        }))
        .filter((item) => Number.isFinite(item.value))
    : [];

  // ==================================================
  // No data
  // ==================================================

  if (safeTimeline.length === 0) {
    return (
      <div className="viz-panel">
        <div className="viz-panel__header">
          <span>Retry Amplification Trend</span>

          <span className="viz-panel__header-tag">
            Traffic Multiplier
          </span>
        </div>

        <div className="viz-panel__content">
          <p className="viz-summary-text">
            No amplification data available.
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // Chart value range
  // ==================================================

  const minVal = 1.0;
  const maxVal = 3.5;

  // ==================================================
  // Convert data → SVG points
  // ==================================================

  const points = safeTimeline.map(
    (item, index) => {
      let x;

      if (safeTimeline.length === 1) {
        // Single point → place it in the center
        x =
          paddingLeft +
          chartWidth / 2;
      } else {
        x =
          paddingLeft +
          (index /
            (safeTimeline.length - 1)) *
            chartWidth;
      }

      // Keep value inside chart range
      const clampedValue = Math.min(
        maxVal,
        Math.max(minVal, item.value)
      );

      const y =
        paddingTop +
        chartHeight -
        ((clampedValue - minVal) /
          (maxVal - minVal)) *
          chartHeight;

      return {
        x,
        y,
        time: item.time,
        value: item.value,
      };
    }
  );

  // ==================================================
  // Line
  // ==================================================

  const polylineStr = points
    .map(
      (point) =>
        `${point.x},${point.y}`
    )
    .join(' ');

  // ==================================================
  // Area under line
  // ==================================================

  const baselineY =
    paddingTop + chartHeight;

  const areaPath =
    points.length > 1
      ? `M ${points[0].x},${baselineY}
         L ${points
           .map(
             (point) =>
               `${point.x},${point.y}`
           )
           .join(' L ')}
         L ${
           points[points.length - 1].x
         },${baselineY}
         Z`
      : '';

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="viz-panel">

      {/* Header */}
      <div className="viz-panel__header">

        <span>
          Retry Amplification Trend
        </span>

        <span className="viz-panel__header-tag">
          Traffic Multiplier
        </span>

      </div>

      {/* Chart */}
      <div className="viz-panel__content">

        <svg
          className="viz-chart-svg"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Retry amplification trend"
        >

          {/* Gradient */}
          <defs>
            <linearGradient
              id="blueGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="#3b82f6"
                stopOpacity="0.5"
              />

              <stop
                offset="100%"
                stopColor="#3b82f6"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* ========================================
              Horizontal grid lines
          ======================================== */}

          {[1.0, 1.5, 2.0, 2.5, 3.0].map(
            (value) => {

              const y =
                paddingTop +
                chartHeight -
                ((value - minVal) /
                  (maxVal - minVal)) *
                  chartHeight;

              return (
                <g key={value}>

                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={
                      width -
                      paddingRight
                    }
                    y2={y}
                    className="viz-chart-grid"
                  />

                  <text
                    x={
                      paddingLeft - 8
                    }
                    y={y + 3}
                    textAnchor="end"
                    className="viz-chart-text"
                  >
                    {value.toFixed(1)}x
                  </text>

                </g>
              );
            }
          )}

          {/* ========================================
              Area
          ======================================== */}

          {areaPath && (
            <path
              d={areaPath}
              className="viz-chart-area"
            />
          )}

          {/* ========================================
              Line
          ======================================== */}

          {points.length > 1 && (
            <polyline
              points={polylineStr}
              className="viz-chart-line"
              fill="none"
            />
          )}

          {/* ========================================
              Points
          ======================================== */}

          {points.map(
            (point, index) => (
              <g key={index}>

                <circle
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  className="viz-chart-point"
                >
                  <title>
                    {`${point.time}: ${point.value.toFixed(
                      2
                    )}x`}
                  </title>
                </circle>

                {/* X-axis label */}
                <text
                  x={point.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="viz-chart-text"
                >
                  {point.time}
                </text>

              </g>
            )
          )}

        </svg>

      </div>
    </div>
  );
}
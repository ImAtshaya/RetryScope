import React from 'react';

export function ComparisonMetrics({ scenarios }) {

  // ----------------------------------------------------------
  // Safety check
  // ----------------------------------------------------------

  if (!scenarios) {
    return (
      <div className="cmp-panel cmp-panel--full">
        <div className="cmp-panel__header">
          <span>Key Metrics Side-by-Side Comparison</span>
          <span className="cmp-panel__header-tag">
            3-Scenario Matrix
          </span>
        </div>

        <div className="cmp-panel__content">
          <p style={{ color: '#94a3b8' }}>
            Scenario data is not available yet.
          </p>
        </div>
      </div>
    );
  }


  // ----------------------------------------------------------
  // Get scenario metrics safely
  // ----------------------------------------------------------

  const b = scenarios.baseline?.metrics || {};
  const r = scenarios.risky?.metrics || {};
  const rec = scenarios.recommended?.metrics || {};


  // ----------------------------------------------------------
  // Helper
  // ----------------------------------------------------------

  const numberValue = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
      ? number.toLocaleString()
      : '0';
  };


  const textValue = (value, fallback = '0') => {
    return value ?? fallback;
  };


  // ----------------------------------------------------------
  // Comparison rows
  // ----------------------------------------------------------

  const rows = [

    {
      label: 'Total Requests',

      b: numberValue(b.totalRequests),

      r: numberValue(r.totalRequests),

      rec: numberValue(rec.totalRequests)
    },


    {
      label: 'Successful Requests',

      b: numberValue(b.successfulRequests),

      r: numberValue(r.successfulRequests),

      rec: numberValue(rec.successfulRequests),

      recHighlight: true
    },


    {
      label: 'Failed Requests (Dropped)',

      b: numberValue(b.failedRequests),

      r: numberValue(r.failedRequests),

      rec: numberValue(rec.failedRequests),

      rHighlight: true,

      recHighlight: true
    },


    {
      label: 'Retry Attempts',

      b: numberValue(b.retryAttempts),

      r: numberValue(r.retryAttempts),

      rec: numberValue(rec.retryAttempts),

      rHighlight: true
    },


    {
      label: 'Retry Amplification Multiplier',

      b: textValue(b.retryAmplification, '1.000x'),

      r: textValue(r.retryAmplification, '1.000x'),

      rec: textValue(rec.retryAmplification, '1.000x'),

      rHighlight: true,

      recHighlight: true
    },


    {
      label: 'Failure Rate',

      b: textValue(b.failureRate, '0.0%'),

      r: textValue(r.failureRate, '0.0%'),

      rec: textValue(rec.failureRate, '0.0%'),

      rHighlight: true,

      recHighlight: true
    },


    {
      label: 'Overall Risk Score',

      b: `${Number(b.overallRisk || 0).toFixed(2)}% (${textValue(b.riskLevel, 'Not Run')})`,

      r: `${Number(r.overallRisk || 0).toFixed(2)}% (${textValue(r.riskLevel, 'Not Run')})`,

      rec: `${Number(rec.overallRisk || 0).toFixed(2)}% (${textValue(rec.riskLevel, 'Not Run')})`,

      rHighlight: true,

      recHighlight: true
    }

  ];


  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (

    <div className="cmp-panel cmp-panel--full">

      <div className="cmp-panel__header">

        <span>
          Key Metrics Side-by-Side Comparison
        </span>

        <span className="cmp-panel__header-tag">
          3-Scenario Matrix
        </span>

      </div>


      <div
        className="cmp-panel__content"
        style={{ padding: 0 }}
      >

        <div className="cmp-table-container">

          <table className="cmp-table">

            <thead>

              <tr>

                <th style={{ width: '35%' }}>
                  Simulation Metric
                </th>

                <th
                  style={{
                    width: '21%',
                    textAlign: 'right'
                  }}
                >
                  Baseline
                </th>

                <th
                  style={{
                    width: '22%',
                    textAlign: 'right',
                    color: '#f87171'
                  }}
                >
                  Risky Config
                </th>

                <th
                  style={{
                    width: '22%',
                    textAlign: 'right',
                    color: '#4ade80'
                  }}
                >
                  Recommended Config
                </th>

              </tr>

            </thead>


            <tbody>

              {rows.map((row, idx) => (

                <tr key={idx}>

                  <td
                    style={{
                      fontWeight: 600,
                      color: '#f1f5f9'
                    }}
                  >
                    {row.label}
                  </td>


                  <td
                    style={{
                      textAlign: 'right'
                    }}
                  >
                    {row.b}
                  </td>


                  <td
                    style={{
                      textAlign: 'right'
                    }}
                    className={
                      row.rHighlight
                        ? 'cmp-table-highlight--risky'
                        : ''
                    }
                  >
                    {row.r}
                  </td>


                  <td
                    style={{
                      textAlign: 'right'
                    }}
                    className={
                      row.recHighlight
                        ? 'cmp-table-highlight--recommended'
                        : ''
                    }
                  >
                    {row.rec}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
import React from 'react';

export function ConfigurationComparison({ scenarios }) {

  const bConfig =
    scenarios.baseline.configuration;

  const rConfig =
    scenarios.risky.configuration;

  const recConfig =
    scenarios.recommended.configuration;

  const rows = [
    {
      label: 'Maximum Retries',
      b: bConfig.maxRetries,
      r: rConfig.maxRetries,
      rec: recConfig.maxRetries
    },
    {
      label: 'Backoff Strategy',
      b: bConfig.backoffStrategy,
      r: rConfig.backoffStrategy,
      rec: recConfig.backoffStrategy
    },
    {
      label: 'Initial Retry Delay',
      b: bConfig.retryDelay,
      r: rConfig.retryDelay,
      rec: recConfig.retryDelay
    },
    {
      label: 'Request Timeout',
      b: bConfig.timeout,
      r: rConfig.timeout,
      rec: recConfig.timeout
    },
    {
      label: 'Jitter',
      b: bConfig.jitter ? 'Enabled' : 'Disabled',
      r: rConfig.jitter ? 'Enabled' : 'Disabled',
      rec: recConfig.jitter ? 'Enabled' : 'Disabled'
    }
  ];

  return (
    <div className="cmp-panel cmp-panel--full">

      <div className="cmp-panel__header">
        <span>
          Policy & Retry Configuration Breakdown
        </span>

        <span className="cmp-panel__header-tag">
          Root Causes
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
                  Configuration Parameter
                </th>

                <th
                  style={{
                    width: '21%',
                    textAlign: 'right'
                  }}
                >
                  Baseline Policy
                </th>

                <th
                  style={{
                    width: '22%',
                    textAlign: 'right',
                    color: '#f87171'
                  }}
                >
                  Risky Policy
                </th>

                <th
                  style={{
                    width: '22%',
                    textAlign: 'right',
                    color: '#4ade80'
                  }}
                >
                  Recommended Policy
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
                      textAlign: 'right',
                      color: '#f87171'
                    }}
                  >
                    {row.r}
                  </td>

                  <td
                    style={{
                      textAlign: 'right',
                      color: '#4ade80',
                      fontWeight: 600
                    }}
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
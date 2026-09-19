import React from 'react';

export function ServiceStatusTable({ services }) {
  const safeServices = Array.isArray(services) ? services : [];

  const getIcon = (type) => {
    switch (String(type).toLowerCase()) {
      case 'gateway':
        return 'G';

      case 'database':
        return 'D';

      case 'cache':
        return 'C';

      default:
        return 'I';
    }
  };

  const getStatusBadge = (status = 'Healthy') => {
    const normalized = String(status).toLowerCase();

    return (
      <span
        className={`sim-status-badge sim-status-badge--${normalized}`}
      >
        ● {status}
      </span>
    );
  };

  return (
    <div className="sim-panel">

      <div className="sim-panel__header">
        <span>Service Degradation &amp; Workload</span>
        <span className="sim-panel__header-tag">
          Breakdown
        </span>
      </div>

      <div
        className="sim-panel__content"
        style={{ padding: 0 }}
      >
        <div className="sim-table-container">

          <table className="sim-table">

            <thead>
              <tr>
                <th>Service</th>

                <th style={{ textAlign: 'right' }}>
                  Total Requests
                </th>

                <th style={{ textAlign: 'right' }}>
                  Failures
                </th>

                <th style={{ textAlign: 'right' }}>
                  Retries
                </th>

                <th style={{ textAlign: 'center' }}>
                  Health Status
                </th>
              </tr>
            </thead>

            <tbody>

              {safeServices.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: 'center',
                      padding: '24px',
                      color: '#64748b'
                    }}
                  >
                    No service results available.
                  </td>
                </tr>

              ) : (

                safeServices.map((svc, index) => {

                  const name =
                    svc.name ||
                    svc.service_name ||
                    svc.service ||
                    `Service ${index + 1}`;

                  const type =
                    svc.type ||
                    'Service';

                  const requests = Number(
                    svc.requests ??
                    svc.total_requests ??
                    svc.request_count ??
                    0
                  );

                  const failures = Number(
                    svc.failures ??
                    svc.failed ??
                    svc.failed_requests ??
                    svc.failure_count ??
                    0
                  );

                  const retries = Number(
                    svc.retries ??
                    svc.total_retries ??
                    svc.retry_count ??
                    0
                  );

                  const status =
                    svc.status ||
                    (failures > 0
                      ? 'Degraded'
                      : 'Healthy');

                  return (
                    <tr
                      key={
                        svc.id ||
                        svc.name ||
                        svc.service_name ||
                        index
                      }
                    >

                      {/* Service */}

                      <td>
                        <div className="sim-table__service">

                          <div
                            className={`sim-table__service-icon sim-node-icon--${name}`}
                          >
                            {getIcon(type)}
                          </div>

                          <div>

                            <div>
                              {name}
                            </div>

                            <div
                              style={{
                                fontSize: '0.6875rem',
                                color: '#64748b',
                                fontWeight: 400
                              }}
                            >
                              {type}
                            </div>

                          </div>

                        </div>
                      </td>

                      {/* Requests */}

                      <td
                        style={{
                          textAlign: 'right',
                          fontWeight: 600,
                          color: '#f8fafc'
                        }}
                      >
                        {requests.toLocaleString()}
                      </td>

                      {/* Failures */}

                      <td
                        style={{
                          textAlign: 'right',
                          fontWeight: 600,
                          color:
                            failures > 0
                              ? '#f87171'
                              : '#64748b'
                        }}
                      >
                        {failures.toLocaleString()}
                      </td>

                      {/* Retries */}

                      <td
                        style={{
                          textAlign: 'right',
                          fontWeight: 600,
                          color:
                            retries > 0
                              ? '#fbbf24'
                              : '#64748b'
                        }}
                      >
                        {retries.toLocaleString()}
                      </td>

                      {/* Status */}

                      <td
                        style={{
                          textAlign: 'center'
                        }}
                      >
                        {getStatusBadge(status)}
                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}
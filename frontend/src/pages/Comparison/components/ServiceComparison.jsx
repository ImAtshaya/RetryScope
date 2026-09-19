import React from 'react';


export function ServiceComparison({
  scenarios
}) {

  // ==========================================================
  // SAFETY CHECK
  // ==========================================================

  if (!scenarios) {

    return (

      <div className="cmp-panel cmp-panel--full">

        <div className="cmp-panel__header">

          <span>
            Microservice Health & Failure Rate Comparison
          </span>

          <span className="cmp-panel__header-tag">
            Tier Analysis
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


  // ==========================================================
  // SERVICE DATA
  // ==========================================================

  const bServices =
    scenarios.baseline?.services || [];


  const rServices =
    scenarios.risky?.services || [];


  const recServices =
    scenarios.recommended?.services || [];


  // ==========================================================
  // STATUS BADGE
  // ==========================================================

  const renderBadge = (
    status = 'Healthy'
  ) => {

    const safeStatus =
      status || 'Healthy';


    const normalizedStatus =
      String(
        safeStatus
      )
        .toLowerCase()
        .replace(
          /\s+/g,
          '-'
        );


    return (

      <span
        className={`cmp-status-badge cmp-status-badge--${normalizedStatus}`}
      >

        ● {safeStatus}

      </span>

    );

  };


  // ==========================================================
  // COMBINE SERVICE NAMES
  // ==========================================================

  const serviceNames = [
    ...new Set([
      ...bServices.map(
        service => service.name
      ),

      ...rServices.map(
        service => service.name
      ),

      ...recServices.map(
        service => service.name
      )
    ])
  ];


  // ==========================================================
  // FIND SERVICE
  // ==========================================================

  function findService(
    services,
    name
  ) {

    return (
      services.find(
        service =>
          service.name === name
      ) || {

        name,

        failureRate:
          '0.0%',

        retryPressure:
          '1.000x',

        status:
          'Healthy'

      }
    );

  }


  // ==========================================================
  // NO SERVICE DATA
  // ==========================================================

  if (
    serviceNames.length === 0
  ) {

    return (

      <div className="cmp-panel cmp-panel--full">

        <div className="cmp-panel__header">

          <span>
            Microservice Health & Failure Rate Comparison
          </span>

          <span className="cmp-panel__header-tag">
            Tier Analysis
          </span>

        </div>


        <div className="cmp-panel__content">

          <p style={{ color: '#94a3b8' }}>
            Run the comparison to display real microservice results.
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="cmp-panel cmp-panel--full">

      <div className="cmp-panel__header">

        <span>
          Microservice Health & Failure Rate Comparison
        </span>

        <span className="cmp-panel__header-tag">
          Tier Analysis
        </span>

      </div>


      <div
        className="cmp-panel__content"
        style={{
          padding: 0
        }}
      >

        <div className="cmp-table-container">

          <table className="cmp-table">

            <thead>

              <tr>

                <th>
                  Service Name
                </th>


                <th
                  style={{
                    textAlign: 'center'
                  }}
                >
                  Baseline (Fail% / Status)
                </th>


                <th
                  style={{
                    textAlign: 'center',
                    color: '#f87171'
                  }}
                >
                  Risky Config (Fail% / Status)
                </th>


                <th
                  style={{
                    textAlign: 'center',
                    color: '#4ade80'
                  }}
                >
                  Recommended (Fail% / Status)
                </th>

              </tr>

            </thead>


            <tbody>

              {serviceNames.map(
                serviceName => {

                  const bSvc =
                    findService(
                      bServices,
                      serviceName
                    );


                  const rSvc =
                    findService(
                      rServices,
                      serviceName
                    );


                  const recSvc =
                    findService(
                      recServices,
                      serviceName
                    );


                  return (

                    <tr
                      key={serviceName}
                    >

                      {/* SERVICE NAME */}

                      <td
                        style={{
                          fontWeight: 700,
                          color: '#f1f5f9'
                        }}
                      >
                        {serviceName}
                      </td>


                      {/* BASELINE */}

                      <td
                        style={{
                          textAlign: 'center'
                        }}
                      >

                        <div
                          style={{
                            display:
                              'inline-flex',

                            alignItems:
                              'center',

                            gap: 10
                          }}
                        >

                          <span
                            style={{
                              fontFamily:
                                'monospace'
                            }}
                          >
                            {bSvc.failureRate}
                          </span>


                          {renderBadge(
                            bSvc.status
                          )}

                        </div>

                      </td>


                      {/* RISKY */}

                      <td
                        style={{
                          textAlign: 'center'
                        }}
                      >

                        <div
                          style={{
                            display:
                              'inline-flex',

                            alignItems:
                              'center',

                            gap: 10
                          }}
                        >

                          <span
                            style={{
                              fontFamily:
                                'monospace',

                              color:
                                '#f87171',

                              fontWeight:
                                600
                            }}
                          >

                            {rSvc.failureRate}
                            {' '}
                            ({rSvc.retryPressure})

                          </span>


                          {renderBadge(
                            rSvc.status
                          )}

                        </div>

                      </td>


                      {/* RECOMMENDED */}

                      <td
                        style={{
                          textAlign: 'center'
                        }}
                      >

                        <div
                          style={{
                            display:
                              'inline-flex',

                            alignItems:
                              'center',

                            gap: 10
                          }}
                        >

                          <span
                            style={{
                              fontFamily:
                                'monospace',

                              color:
                                '#4ade80',

                              fontWeight:
                                600
                            }}
                          >

                            {recSvc.failureRate}
                            {' '}
                            ({recSvc.retryPressure})

                          </span>


                          {renderBadge(
                            recSvc.status
                          )}

                        </div>

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}
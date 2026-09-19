import React from 'react';

import { SCENARIOS } from '../data/comparisonData';


export function ScenarioSelector({
  selectedScenario,
  onSelectScenario,
  scenarios
}) {

  // Prefer scenarios supplied by ComparisonPage.
  // Fall back to the module-level SCENARIOS export.
  const scenarioData =
    scenarios || SCENARIOS || {};

  const scenarioList =
    Object.values(scenarioData);


  // ----------------------------------------------------------
  // Safety guard
  // ----------------------------------------------------------

  if (scenarioList.length === 0) {

    return (
      <div
        className="cmp-scenarios-grid"
        style={{
          padding: '20px',
          color: '#94a3b8'
        }}
      >
        No scenario data available.
      </div>
    );
  }


  return (

    <div className="cmp-scenarios-grid">

      {scenarioList.map((sc) => {

        const isActive =
          selectedScenario === sc.id;


        let activeClass = '';


        if (isActive) {

          if (sc.id === 'risky') {

            activeClass =
              'cmp-scenario-card--active-risky';

          } else if (sc.id === 'recommended') {

            activeClass =
              'cmp-scenario-card--active-recommended';

          } else {

            activeClass =
              'cmp-scenario-card--active';
          }
        }


        const metrics =
          sc.metrics || {};


        const overallRisk =
          Number(metrics.overallRisk) || 0;


        const amplification =
          Number(
            metrics.retryAmplificationVal
          ) || 1;


        return (

          <div
            key={sc.id}
            className={
              `cmp-scenario-card ${activeClass}`
            }
            onClick={() =>
              onSelectScenario(sc.id)
            }
          >

            <div className="cmp-scenario-header">

              <span className="cmp-scenario-title">
                {sc.name}
              </span>

              <span
                className={
                  `scenario-badge ${sc.badgeClass}`
                }
              >
                {sc.badge}
              </span>

            </div>


            <p className="cmp-scenario-desc">
              {sc.description}
            </p>


            <div className="cmp-scenario-quick-stats">

              <span>
                Risk:{' '}

                <strong
                  style={{
                    color:
                      overallRisk > 50
                        ? '#f87171'
                        : '#4ade80'
                  }}
                >
                  {overallRisk.toFixed(2)}%
                </strong>
              </span>


              <span>
                Amplification:{' '}

                <strong
                  style={{
                    color:
                      amplification > 2
                        ? '#f87171'
                        : '#60a5fa'
                  }}
                >
                  {amplification.toFixed(3)}x
                </strong>
              </span>


              <span>
                Failures:{' '}

                <strong>
                  {metrics.failureRate || '0.0%'}
                </strong>
              </span>

            </div>

          </div>
        );
      })}

    </div>
  );
}
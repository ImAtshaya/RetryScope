import React from 'react';

export function EngineeringInsight({ insight }) {

  // --------------------------------------------------
  // Safety fallback
  // --------------------------------------------------
  if (!insight) {
    return (
      <div className="cmp-panel cmp-panel--full">

        <div className="cmp-panel__header">
          <span>Engineering Insight & Analysis</span>
          <span className="cmp-panel__header-tag">
            Evaluation
          </span>
        </div>

        <div className="cmp-panel__content">

          <p className="cmp-insight-text">
            Run the comparison to generate engineering
            insights from the real simulation results.
          </p>

        </div>

      </div>
    );
  }


  // --------------------------------------------------
  // Render real engineering insight
  // --------------------------------------------------
  return (
    <div className="cmp-panel cmp-panel--full">

      <div className="cmp-panel__header">

        <span>
          Engineering Insight & Analysis
        </span>

        <span className="cmp-panel__header-tag">
          Evaluation
        </span>

      </div>


      <div className="cmp-panel__content">

        {/* -------------------------------------------- */}
        {/* Main narrative */}
        {/* -------------------------------------------- */}

        <p className="cmp-insight-text">
          {insight.narrative}
        </p>


        {/* -------------------------------------------- */}
        {/* Engineering findings */}
        {/* -------------------------------------------- */}

        <div className="cmp-insight-grid">


          {/* Primary Finding */}
          <div className="cmp-insight-item">

            <span className="cmp-insight-label">
              Primary Finding
            </span>

            <span className="cmp-insight-value cmp-insight-value--success">
              {insight.primaryFinding}
            </span>

          </div>


          {/* Biggest Improvement */}
          <div className="cmp-insight-item">

            <span className="cmp-insight-label">
              Biggest Improvement
            </span>

            <span className="cmp-insight-value cmp-insight-value--success">
              {insight.biggestImprovement}
            </span>

          </div>


          {/* Highest Risk Scenario */}
          <div className="cmp-insight-item">

            <span className="cmp-insight-label">
              Highest Risk Scenario
            </span>

            <span className="cmp-insight-value cmp-insight-value--danger">
              {insight.highestRiskScenario}
            </span>

          </div>


          {/* Recommended Action */}
          <div className="cmp-insight-item">

            <span className="cmp-insight-label">
              Recommended Action
            </span>

            <span
              className="cmp-insight-value"
              style={{ color: '#60a5fa' }}
            >
              {insight.recommendedAction}
            </span>

          </div>


        </div>

      </div>

    </div>
  );
}
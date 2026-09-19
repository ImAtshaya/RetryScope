import React from 'react';

import {
  getDerivedRiskReduction
} from '../data/comparisonData';


export function BeforeAfter({
  scenarios
}) {

  // ==========================================================
  // SAFETY CHECK
  // ==========================================================

  if (!scenarios) {

    return (
      <div className="cmp-before-after-card">

        <p style={{ color: '#94a3b8' }}>
          Scenario data is not available yet.
        </p>

      </div>
    );

  }


  const risky =
    scenarios.risky?.metrics || {};

  const recommended =
    scenarios.recommended?.metrics || {};


  const reduction =
    getDerivedRiskReduction();


  const riskReduction =
    Math.abs(
      reduction.riskReductionPts || 0
    );


  const failureReduction =
    Math.abs(
      reduction.failureRateReductionPts || 0
    );


  return (

    <div className="cmp-before-after-card">

      <div className="cmp-ba-header">

        <h2 className="cmp-ba-title">
          Before vs. Recommended Policy Impact
        </h2>

        <span className="scenario-badge scenario-badge--recommended">

          {reduction.recommendedImprovesRisk
            ? `${riskReduction.toFixed(2)} pts Risk Mitigation`
            : 'Risk Requires Review'}

        </span>

      </div>


      <div className="cmp-ba-grid">

        {/* ==================================================
            RISKY
        ================================================== */}

        <div className="cmp-ba-side cmp-ba-side--risky">

          <div className="cmp-ba-side-title cmp-ba-side-title--risky">

            ⚠ Risky Configuration (Current Hazard)

          </div>


          <div className="cmp-ba-stat-row">

            <span className="cmp-ba-stat-label">
              Overall Risk Score:
            </span>

            <span
              className="cmp-ba-stat-val"
              style={{ color: '#f87171' }}
            >
              {Number(
                risky.overallRisk || 0
              ).toFixed(2)}
              %
              {' '}
              ({risky.riskLevel || 'Not Run'})
            </span>

          </div>


          <div className="cmp-ba-stat-row">

            <span className="cmp-ba-stat-label">
              Retry Amplification:
            </span>

            <span
              className="cmp-ba-stat-val"
              style={{ color: '#f87171' }}
            >
              {risky.retryAmplification || '1.000x'}
            </span>

          </div>


          <div className="cmp-ba-stat-row">

            <span className="cmp-ba-stat-label">
              Service Failure Rate:
            </span>

            <span className="cmp-ba-stat-val">
              {risky.failureRate || '0.0%'}
            </span>

          </div>


          <div className="cmp-ba-stat-row">

            <span className="cmp-ba-stat-label">
              Failed Requests:
            </span>

            <span className="cmp-ba-stat-val">
              {Number(
                risky.failedRequests || 0
              ).toLocaleString()}
              {' '}
              calls
            </span>

          </div>

        </div>


        {/* ==================================================
            ARROW
        ================================================== */}

        <div className="cmp-ba-arrow">

          <span className="cmp-ba-arrow__pill">
            Policy Shift
          </span>

          <span className="cmp-ba-arrow__icon">
            ➔
          </span>

        </div>


        {/* ==================================================
            RECOMMENDED
        ================================================== */}

        <div className="cmp-ba-side cmp-ba-side--recommended">

          <div className="cmp-ba-side-title cmp-ba-side-title--recommended">

            ✔ Recommended Configuration (Protected)

          </div>


          <div className="cmp-ba-stat-row">

            <span className="cmp-ba-stat-label">
              Overall Risk Score:
            </span>

            <span
              className="cmp-ba-stat-val"
              style={{
                color:
                  reduction.recommendedImprovesRisk
                    ? '#4ade80'
                    : '#f87171'
              }}
            >
              {Number(
                recommended.overallRisk || 0
              ).toFixed(2)}
              %
              {' '}
              ({recommended.riskLevel || 'Not Run'})
            </span>

          </div>


          <div className="cmp-ba-stat-row">

            <span className="cmp-ba-stat-label">
              Retry Amplification:
            </span>

            <span
              className="cmp-ba-stat-val"
              style={{
                color:
                  reduction.recommendedImprovesAmplification
                    ? '#4ade80'
                    : '#f87171'
              }}
            >
              {recommended.retryAmplification || '1.000x'}
            </span>

          </div>


          <div className="cmp-ba-stat-row">

            <span className="cmp-ba-stat-label">
              Service Failure Rate:
            </span>

            <span className="cmp-ba-stat-val">
              {recommended.failureRate || '0.0%'}
            </span>

          </div>


          <div className="cmp-ba-stat-row">

            <span className="cmp-ba-stat-label">
              Failed Requests:
            </span>

            <span className="cmp-ba-stat-val">
              {Number(
                recommended.failedRequests || 0
              ).toLocaleString()}
              {' '}
              calls
            </span>

          </div>

        </div>

      </div>


      {/* ======================================================
          REDUCTION HIGHLIGHTS
      ====================================================== */}

      <div className="cmp-reduction-highlights">

        <div className="cmp-reduction-item">

          <span className="cmp-reduction-label">
            Risk Reduction
          </span>

          <span className="cmp-reduction-value">

            {riskReduction.toFixed(2)}
            {' '}
            pts

          </span>

          <span className="cmp-reduction-sub">

            {Number(
              risky.overallRisk || 0
            ).toFixed(2)}
            %
            {' ➔ '}
            {Number(
              recommended.overallRisk || 0
            ).toFixed(2)}
            %

          </span>

        </div>


        <div className="cmp-reduction-item">

          <span className="cmp-reduction-label">
            Amplification Cut
          </span>

          <span className="cmp-reduction-value">

            {reduction.ampPctReduction || 0}%

          </span>

          <span className="cmp-reduction-sub">

            {reduction.recommendedImprovesAmplification
              ? `Reduced by ${reduction.ampReduction}`
              : `Changed by ${reduction.ampReduction}`}

          </span>

        </div>


        <div className="cmp-reduction-item">

          <span className="cmp-reduction-label">
            Failed Calls Prevented
          </span>

          <span className="cmp-reduction-value">

            {Math.max(
              0,
              reduction.failedRequestsPctSaved || 0
            )}%

          </span>

          <span className="cmp-reduction-sub">

            {Math.max(
              0,
              reduction.failedRequestsSaved || 0
            ).toLocaleString()}

            {' fewer failed requests'}

          </span>

        </div>


        <div className="cmp-reduction-item">

          <span className="cmp-reduction-label">
            Failure Rate Reduction
          </span>

          <span className="cmp-reduction-value">

            {failureReduction.toFixed(2)}
            {' '}
            pts

          </span>

          <span className="cmp-reduction-sub">

            {risky.failureRate || '0.0%'}
            {' ➔ '}
            {recommended.failureRate || '0.0%'}

          </span>

        </div>

      </div>

    </div>

  );

}
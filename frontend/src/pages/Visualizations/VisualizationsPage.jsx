import React, { useEffect, useState } from 'react';
import './VisualizationsPage.css';

import { getSimulationResult } from '../../services';


/* ============================================================
   HELPERS
   ============================================================ */

function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}


function getRiskLevel(score) {
  const value = toNumber(score);

  if (value >= 75) {
    return 'Critical';
  }

  if (value >= 50) {
    return 'High';
  }

  if (value >= 25) {
    return 'Moderate';
  }

  return 'Low';
}


function getRecommendationText(result) {
  const recommendation =
    result?.recommendation || {};

  return (
    recommendation.recommendation ||
    recommendation.message ||
    recommendation.action ||
    recommendation.summary ||
    recommendation.description ||
    'Review the calculated risk factors and adjust retry configuration.'
  );
}


/* ============================================================
   BUILD VISUALIZATION DATA
   ============================================================ */

function buildVisualizationData(result) {
  const simulation =
    result?.simulation || {};

  const risk =
    result?.risk || {};


  /* ----------------------------------------------------------
     TOTAL ORIGINAL REQUESTS
     ---------------------------------------------------------- */

  let totalRequests = toNumber(
    simulation.total_requests ??
      simulation.totalRequests ??
      simulation.original_requests,
    0
  );


  if (totalRequests <= 0) {
    const users = toNumber(
      simulation.users ??
        simulation.number_of_users,
      0
    );

    const requestsPerUser = toNumber(
      simulation.requests_per_user ??
        simulation.requestsPerUser,
      0
    );

    if (
      users > 0 &&
      requestsPerUser > 0
    ) {
      totalRequests =
        users * requestsPerUser;
    }
  }


  /* ----------------------------------------------------------
     FAILED ORIGINAL REQUESTS
     ---------------------------------------------------------- */

  const failedRequests = Math.max(
    toNumber(
      simulation.failed_requests ??
        simulation.failedRequests,
      0
    ),
    0
  );


  /* ----------------------------------------------------------
     SUCCESSFUL ORIGINAL REQUESTS
     ---------------------------------------------------------- */

  const successfulRequests = Math.max(
    toNumber(
      simulation.successful_requests ??
        simulation.successfulRequests,
      totalRequests - failedRequests
    ),
    0
  );


  /* ----------------------------------------------------------
     RETRIES
     ---------------------------------------------------------- */

  const totalRetries = Math.max(
    toNumber(
      simulation.total_retries ??
        simulation.totalRetries,
      0
    ),
    0
  );


  /* ----------------------------------------------------------
     TOTAL ATTEMPTS
     ---------------------------------------------------------- */

  const totalAttempts = Math.max(
    toNumber(
      simulation.total_attempts ??
        simulation.totalAttempts,
      totalRequests + totalRetries
    ),
    0
  );


  /* ----------------------------------------------------------
     RETRY AMPLIFICATION
     ---------------------------------------------------------- */

  let retryAmplification =
    toNumber(
      simulation.retry_amplification_factor ??
        simulation.retryAmplificationFactor,
      0
    );


  /*
   * If backend does not provide amplification,
   * calculate it from attempts.
   */
  if (
    retryAmplification <= 0 &&
    totalRequests > 0
  ) {
    retryAmplification =
      totalAttempts / totalRequests;
  }


  /* ----------------------------------------------------------
     OVERALL RISK
     ---------------------------------------------------------- */

  const overallRisk = Math.max(
    toNumber(
      risk.overall_score ??
        risk.overall_risk_score ??
        risk.score,
      0
    ),
    0
  );


  const riskLevel =
    risk.risk_level ||
    risk.level ||
    risk.classification ||
    getRiskLevel(overallRisk);


  /* ==========================================================
     RISK BREAKDOWN
     ========================================================== */

  const retryRisk = Math.max(
    toNumber(
      risk.retry_risk ??
        risk.retry_storm_risk ??
        risk.retryRisk,
      0
    ),
    0
  );


  const cascadeRisk = Math.max(
    toNumber(
      risk.cascade_risk ??
        risk.cascading_failure_risk ??
        risk.cascadeRisk,
      0
    ),
    0
  );


  const loadRisk = Math.max(
    toNumber(
      risk.load_amplification_risk ??
        risk.load_risk ??
        risk.loadAmplificationRisk,
      0
    ),
    0
  );


  const stabilityRisk = Math.max(
    toNumber(
      risk.service_stability_risk ??
        risk.stability_risk ??
        risk.serviceStabilityRisk,
      0
    ),
    0
  );


  /* ==========================================================
     OUTCOME PERCENTAGES
     ========================================================== */

  const successfulPercent =
    totalRequests > 0
      ? Math.round(
          (successfulRequests /
            totalRequests) *
            100
        )
      : 0;


  const failedPercent =
    totalRequests > 0
      ? Math.round(
          (failedRequests /
            totalRequests) *
            100
        )
      : 0;


  /*
   * Retry percentage represents retry attempts
   * compared with original requests.
   *
   * It is intentionally NOT part of the
   * successful/failed percentage total.
   */
  const retryPercent =
    totalRequests > 0
      ? Math.round(
          (totalRetries /
            totalRequests) *
            100
        )
      : 0;


  /* ==========================================================
     NARRATIVE
     ========================================================== */

  const service =
    simulation.service ||
    'the simulated service';


  const narrative =
    `The latest simulation processed ${totalRequests} original requests for ${service}. ` +
    `The simulation recorded ${failedRequests} final failed requests and ` +
    `${totalRetries} retry attempts, producing a ` +
    `${retryAmplification.toFixed(3)}x retry amplification factor. ` +
    `The calculated system risk is ${overallRisk}%.`;


  /* ==========================================================
     RETURN
     ========================================================== */

  return {

    summary: {
      totalRequests,
      failedRequests,
      totalRetries,
      totalAttempts,
      retryAmplification,
      overallRisk,
      riskLevel
    },


    outcomes: {
      successful: {
        count: successfulRequests,
        percent: successfulPercent
      },

      failed: {
        count: failedRequests,
        percent: failedPercent
      },

      retried: {
        count: totalRetries,
        percent: retryPercent
      }
    },


    riskBreakdown: [
      {
        label: 'Retry Storm Risk',
        score: retryRisk,
        level: getRiskLevel(retryRisk),
        description:
          'Retry amplification and retry pressure'
      },

      {
        label: 'Cascading Failure Risk',
        score: cascadeRisk,
        level: getRiskLevel(cascadeRisk),
        description:
          'Failure propagation across dependencies'
      },

      {
        label: 'Load Amplification Risk',
        score: loadRisk,
        level: getRiskLevel(loadRisk),
        description:
          'Additional downstream request load'
      },

      {
        label: 'Service Stability Risk',
        score: stabilityRisk,
        level: getRiskLevel(stabilityRisk),
        description:
          'Service failure and recovery pressure'
      }
    ],


    analysisSummary: {
      narrative,

      primaryBottleneck:
        failedRequests > 0
          ? `${service} (${failedRequests} failed requests)`
          : 'No affected service',

      peakRetryMultiplier:
        retryAmplification > 0
          ? `${service} (${retryAmplification.toFixed(3)}x multiplier)`
          : 'No amplification',

      aggregateSystemRisk:
        `${overallRisk}% (${riskLevel} Risk)`,

      recommendation:
        getRecommendationText(result)
    }
  };
}


/* ============================================================
   SMALL COMPONENTS
   ============================================================ */

function SummaryCard({
  title,
  value,
  subtitle
}) {
  return (
    <div className="viz-summary-card">

      <div className="viz-summary-card__title">
        {title}
      </div>

      <div className="viz-summary-card__value">
        {value}
      </div>

      <div className="viz-summary-card__subtitle">
        {subtitle}
      </div>

    </div>
  );
}


function OutcomeRow({
  label,
  count,
  percent
}) {
  return (
    <div className="viz-outcome-row">

      <div className="viz-outcome-row__header">

        <span>
          {label}
        </span>

        <span>
          {count} calls
          {' '}
          <strong>
            {percent}%
          </strong>
        </span>

      </div>


      <div className="viz-progress">

        <div
          className="viz-progress__bar"
          style={{
            width: `${Math.min(
              Math.max(percent, 0),
              100
            )}%`
          }}
        />

      </div>

    </div>
  );
}


function RiskRow({
  label,
  score,
  level,
  description
}) {
  return (
    <div className="viz-risk-row">

      <div className="viz-risk-row__top">

        <div>
          <strong>
            {label}
          </strong>

          <span>
            {level} ({score}%)
          </span>
        </div>

        <strong>
          {score} / 100
        </strong>

      </div>


      <p>
        {description}
      </p>

    </div>
  );
}


/* ============================================================
   VISUALIZATIONS PAGE
   ============================================================ */

function VisualizationsPage() {

  const [
    data,
    setData
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    refreshing,
    setRefreshing
  ] = useState(false);


  const [
    error,
    setError
  ] = useState('');


  const [
    toastMessage,
    setToastMessage
  ] = useState('');


  /* ==========================================================
     LOAD LATEST SIMULATION
     ========================================================== */

  const loadLatestSimulation =
    async () => {

      setError('');


      const storedId =
        localStorage.getItem(
          'lastSimulationId'
        );


      if (!storedId) {

        setData(null);

        setLoading(false);

        setRefreshing(false);

        return;
      }


      const simulationId =
        Number(storedId);


      if (
        !Number.isFinite(
          simulationId
        )
      ) {

        setError(
          'The saved simulation ID is invalid.'
        );

        setLoading(false);

        setRefreshing(false);

        return;
      }


      try {

        const result =
          await getSimulationResult(
            simulationId
          );


        const processedData =
          buildVisualizationData(
            result
          );


        setData(
          processedData
        );

      } catch (err) {

        console.error(
          'Failed to load simulation result:',
          err
        );


        setError(
          err?.message ||
            'Failed to load simulation result.'
        );

      } finally {

        setLoading(false);

        setRefreshing(false);
      }
    };


  /* ==========================================================
     INITIAL LOAD
     ========================================================== */

  useEffect(() => {

    loadLatestSimulation();

  }, []);


  /* ==========================================================
     TOAST
     ========================================================== */

  useEffect(() => {

    if (!toastMessage) {
      return;
    }


    const timer =
      setTimeout(() => {

        setToastMessage('');

      }, 3000);


    return () => {
      clearTimeout(timer);
    };

  }, [toastMessage]);


  /* ==========================================================
     REFRESH
     ========================================================== */

  const handleRefresh =
    async () => {

      setRefreshing(true);

      await loadLatestSimulation();

      setToastMessage(
        'Visualization metrics refreshed'
      );
    };


  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {

    return (
      <section
        className="visualizations-page"
      >

        <div className="viz-header">

          <div>

            <h1>
              Visualizations
            </h1>

            <p>
              Loading simulation results...
            </p>

          </div>

        </div>

      </section>
    );
  }


  /* ==========================================================
     ERROR
     ========================================================== */

  if (error) {

    return (
      <section
        className="visualizations-page"
      >

        <div className="viz-header">

          <div>

            <h1>
              Visualizations
            </h1>

            <p>
              Unable to load simulation results.
            </p>

          </div>


          <button
            className="btn btn--primary"
            onClick={handleRefresh}
          >
            Retry
          </button>

        </div>


        <div className="viz-panel">

          <p>
            {error}
          </p>

        </div>

      </section>
    );
  }


  /* ==========================================================
     NO DATA
     ========================================================== */

  if (!data) {

    return (
      <section
        className="visualizations-page"
      >

        <div className="viz-header">

          <div>

            <h1>
              Visualizations
            </h1>

            <p>
              Run a simulation to view real analysis results.
            </p>

          </div>


          <button
            className="btn btn--primary"
            onClick={handleRefresh}
          >
            Refresh Analysis
          </button>

        </div>


        <div className="viz-panel">

          <p>
            No simulation result is available yet.
            Run a simulation first.
          </p>

        </div>

      </section>
    );
  }


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <section
      className="visualizations-page"
    >

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="viz-header">

        <div>

          <h1>
            Visualizations
          </h1>

          <p>
            Analyze retry behaviour,
            service failures,
            load amplification,
            and system risk through
            real simulation metrics.
          </p>

        </div>


        <div className="viz-header__actions">

          <button
            className="btn btn--primary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing
              ? 'Refreshing...'
              : 'Refresh Analysis'}
          </button>

        </div>

      </div>


      {/* ======================================================
          TOAST
          ====================================================== */}

      {toastMessage && (

        <div className="viz-toast">
          {toastMessage}
        </div>

      )}


      {/* ======================================================
          SUMMARY
          ====================================================== */}

      <section className="viz-section">

        <div className="viz-section__header">

          <h2>
            Summary
          </h2>

        </div>


        <div className="viz-summary-grid">

          <SummaryCard
            title="Total Requests"
            value={
              data.summary.totalRequests
            }
            subtitle="Original requests"
          />


          <SummaryCard
            title="Failed Requests"
            value={
              data.summary.failedRequests
            }
            subtitle={
              data.summary.totalRequests > 0
                ? `${Math.round(
                    (
                      data.summary.failedRequests /
                      data.summary.totalRequests
                    ) * 100
                  )}% drop rate`
                : '0% drop rate'
            }
          />


          <SummaryCard
            title="Retry Attempts"
            value={
              data.summary.totalRetries
            }
            subtitle="Re-dispatched calls"
          />


          <SummaryCard
            title="Retry Amplification"
            value={
              `${data.summary.retryAmplification.toFixed(3)}x`
            }
            subtitle="Traffic multiplier"
          />


          <SummaryCard
            title="Overall Risk"
            value={
              `${data.summary.overallRisk}%`
            }
            subtitle={
              `${data.summary.riskLevel} severity`
            }
          />

        </div>

      </section>


      {/* ======================================================
          REQUEST OUTCOME DISTRIBUTION
          ====================================================== */}

      <section className="viz-section">

        <div className="viz-section__header">

          <h2>
            Request Outcome Distribution
          </h2>

          <span>
            Original request results
          </span>

        </div>


        <div className="viz-panel">

          <OutcomeRow
            label="Successful Requests"
            count={
              data.outcomes.successful.count
            }
            percent={
              data.outcomes.successful.percent
            }
          />


          <OutcomeRow
            label="Failed Requests"
            count={
              data.outcomes.failed.count
            }
            percent={
              data.outcomes.failed.percent
            }
          />


          <OutcomeRow
            label="Retried Requests"
            count={
              data.outcomes.retried.count
            }
            percent={
              data.outcomes.retried.percent
            }
          />


          <div className="viz-note">

            Retry attempts are additional service
            calls and are therefore not added to
            successful + failed original requests.

          </div>

        </div>

      </section>


      {/* ======================================================
          RISK BREAKDOWN
          ====================================================== */}

      <section className="viz-section">

        <div className="viz-section__header">

          <h2>
            Risk Breakdown Overview
          </h2>

          <span>
            Threat categories
          </span>

        </div>


        <div className="viz-panel">

          {data.riskBreakdown.map(
            (item) => (

              <RiskRow
                key={item.label}
                label={item.label}
                score={item.score}
                level={item.level}
                description={
                  item.description
                }
              />

            )
          )}

        </div>

      </section>


      {/* ======================================================
          ANALYSIS SUMMARY
          ====================================================== */}

      <section className="viz-section">

        <div className="viz-section__header">

          <h2>
            Analysis Summary & Engineering Insights
          </h2>

          <span>
            Executive summary
          </span>

        </div>


        <div className="viz-panel">

          <div className="viz-analysis-item">

            <h3>
              Executive Summary
            </h3>

            <p>
              {data.analysisSummary.narrative}
            </p>

          </div>


          <div className="viz-analysis-grid">

            <div className="viz-analysis-item">

              <h3>
                Primary Bottleneck
              </h3>

              <p>
                {
                  data.analysisSummary
                    .primaryBottleneck
                }
              </p>

            </div>


            <div className="viz-analysis-item">

              <h3>
                Peak Retry Multiplier
              </h3>

              <p>
                {
                  data.analysisSummary
                    .peakRetryMultiplier
                }
              </p>

            </div>


            <div className="viz-analysis-item">

              <h3>
                Aggregate System Risk
              </h3>

              <p>
                {
                  data.analysisSummary
                    .aggregateSystemRisk
                }
              </p>

            </div>


            <div className="viz-analysis-item">

              <h3>
                Mitigation Priority
              </h3>

              <p>
                {
                  data.analysisSummary
                    .recommendation
                }
              </p>

            </div>

          </div>

        </div>

      </section>

    </section>
  );
}


export default VisualizationsPage;
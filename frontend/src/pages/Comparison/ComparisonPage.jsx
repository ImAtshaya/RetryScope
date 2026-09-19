import React, {
  useState,
  useEffect
} from 'react';

import './ComparisonPage.css';

import {
  ScenarioSelector,
  BeforeAfter,
  ComparisonMetrics,
  ComparisonCharts,
  RetryComparison,
  ServiceComparison,
  ConfigurationComparison,
  EngineeringInsight
} from './components';

import {
  SCENARIOS,
  SCENARIO_CONFIGS,
  updateScenarioFromResult,
  buildEngineeringInsight,
  resetScenarios
} from './data/comparisonData';

import { runSimulation } from '../../services/simulationApi';


function ComparisonPage() {

  // ============================================================
  // STATE
  // ============================================================

  const [
    selectedScenario,
    setSelectedScenario
  ] = useState('recommended');

  const [
    isRunning,
    setIsRunning
  ] = useState(false);

  const [
    toastMessage,
    setToastMessage
  ] = useState('');

  const [
    error,
    setError
  ] = useState('');

  const [
    comparisonVersion,
    setComparisonVersion
  ] = useState(0);


  // ============================================================
  // TOAST AUTO HIDE
  // ============================================================

  useEffect(() => {

    if (!toastMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setToastMessage('');
    }, 3000);

    return () => clearTimeout(timer);

  }, [toastMessage]);


  // ============================================================
  // REFRESH UI
  // ============================================================

  const refreshComparison = () => {

    setComparisonVersion(
      value => value + 1
    );

  };


  // ============================================================
  // RUN ALL THREE REAL BACKEND SCENARIOS
  // ============================================================

  const handleRunComparison = async () => {

    if (isRunning) {
      return;
    }

    setIsRunning(true);
    setError('');
    setToastMessage('');

    try {

      const scenarioIds = [
        'baseline',
        'risky',
        'recommended'
      ];


      // --------------------------------------------------------
      // Run each scenario against the REAL backend
      // --------------------------------------------------------

      for (const scenarioId of scenarioIds) {

        const config =
          SCENARIO_CONFIGS[scenarioId];

        if (!config) {
          throw new Error(
            `Scenario configuration not found: ${scenarioId}`
          );
        }

        // ------------------------------------------------------
        // Backend simulation configuration
        // ------------------------------------------------------

        const simulationConfig = {

          number_of_users: 100,

          service_name: 'inventory',

          requests_per_user: 10,

          duration: 60,

          failure_rate: 30,
            
            

          random_seed: 42,

          max_retries:
            config.configuration.maxRetriesVal,

          backoff:
            scenarioId === 'risky'
              ? 'fixed'
              : 'exponential',

          base_retry_delay:
            scenarioId === 'baseline'
              ? 0.2
              : scenarioId === 'risky'
                ? 0.05
                : 0.5,

          jitter:
            config.configuration.jitter,

          timeout:
            scenarioId === 'baseline'
              ? 2
              : scenarioId === 'risky'
                ? 5
                : 2.5
        };

        // ------------------------------------------------------
        // POST /simulation/run
        // ------------------------------------------------------

        const response =
          await runSimulation(
            simulationConfig
          );


        // ------------------------------------------------------
        // Convert backend result to UI scenario
        // ------------------------------------------------------

        updateScenarioFromResult(
          scenarioId,
          response
        );

      }


      // --------------------------------------------------------
      // Force all comparison components to refresh
      // --------------------------------------------------------

      refreshComparison();


      setToastMessage(
        'Real scenario comparison completed successfully.'
      );

    } catch (err) {

      console.error(
        'Comparison failed:',
        err
      );

      setError(
        err?.message ||
        'Failed to run scenario comparison.'
      );

    } finally {

      setIsRunning(false);

    }

  };


  // ============================================================
  // RESET
  // ============================================================

  const handleReset = () => {

    resetScenarios();

    setSelectedScenario(
      'recommended'
    );

    setError('');

    setToastMessage(
      'Comparison reset.'
    );

    refreshComparison();

  };


  // ============================================================
  // ENGINEERING INSIGHT
  // ============================================================

  const engineeringInsight =
    buildEngineeringInsight();


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <section
      className="comparison-page"
      key={comparisonVersion}
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="cmp-header">

        <div>

          <h1 className="cmp-header__title">
            Comparison
          </h1>

          <p className="cmp-header__subtitle">
            Compare simulation scenarios to
            understand how retry configuration
            affects system reliability.
          </p>

        </div>


        <div className="cmp-header__actions">

          <button
            className="btn btn--secondary"
            onClick={handleReset}
            disabled={isRunning}
          >
            Reset
          </button>


          <button
            className="btn btn--primary"
            onClick={handleRunComparison}
            disabled={isRunning}
          >
            {isRunning
              ? 'Running Comparison...'
              : 'Run Comparison'}
          </button>

        </div>

      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: '#7f1d1d',
            color: '#fecaca'
          }}
        >
          {error}
        </div>

      )}


      {/* ======================================================
          TOAST
      ====================================================== */}

      {toastMessage && (

        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#22c55e',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            zIndex: 9999,
            fontWeight: 500,
            fontSize: '0.875rem'
          }}
        >
          {toastMessage}
        </div>

      )}


      {/* ======================================================
          SCENARIO SELECTOR
      ====================================================== */}

      <ScenarioSelector
        scenarios={SCENARIOS}
        selectedScenario={selectedScenario}
        onSelectScenario={
          setSelectedScenario
        }
      />


      {/* ======================================================
          BEFORE / AFTER
      ====================================================== */}

      <BeforeAfter
        scenarios={SCENARIOS}
      />


      {/* ======================================================
          METRICS
      ====================================================== */}

      <ComparisonMetrics
        scenarios={SCENARIOS}
      />


      {/* ======================================================
          CHARTS + RETRY COMPARISON
      ====================================================== */}

      <div className="cmp-grid-2col">

        <ComparisonCharts
          scenarios={SCENARIOS}
        />

        <RetryComparison
          scenarios={SCENARIOS}
        />

      </div>


      {/* ======================================================
          SERVICE COMPARISON
      ====================================================== */}

      <ServiceComparison
        scenarios={SCENARIOS}
      />


      {/* ======================================================
          CONFIGURATION COMPARISON
      ====================================================== */}

      <ConfigurationComparison
        scenarios={SCENARIOS}
      />


      {/* ======================================================
          ENGINEERING INSIGHT
      ====================================================== */}

      <EngineeringInsight
        insight={engineeringInsight}
        scenarios={SCENARIOS}
      />

    </section>

  );

}


export default ComparisonPage;
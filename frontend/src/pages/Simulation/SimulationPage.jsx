import React, { useState, useEffect } from 'react';
import './SimulationPage.css';

import { DEFAULT_SIMULATION_CONFIG } from './data/simulationData';
import { runSimulation } from '../../services';

import {
  SimulationConfig,
  RetryConfiguration,
  SimulationPreview,
  SimulationMetrics,
  SimulationResults
} from './components';

function SimulationPage() {
  const [config, setConfig] = useState(DEFAULT_SIMULATION_CONFIG);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // =========================================================
  // Restore simulation configuration
  // =========================================================

  useEffect(() => {
    const savedConfig = localStorage.getItem(
      'retryscope_simulation_config'
    );

    if (!savedConfig) return;

    try {
      setConfig(JSON.parse(savedConfig));
    } catch {
      localStorage.removeItem(
        'retryscope_simulation_config'
      );
    }
  }, []);

  // =========================================================
  // Auto-hide toast
  // =========================================================

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  // =========================================================
  // Configuration change
  // =========================================================

  const handleConfigChange = (field, value) => {
    setValidationError('');

    setConfig((prev) => {
      const updatedConfig = {
        ...prev,
        [field]: value
      };

      localStorage.setItem(
        'retryscope_simulation_config',
        JSON.stringify(updatedConfig)
      );

      return updatedConfig;
    });
  };

  // =========================================================
  // Validate configuration
  // =========================================================

  const validate = () => {
    if (!config.users || config.users <= 0) {
      return 'Number of users must be greater than 0.';
    }

    if (!config.requestsPerUser || config.requestsPerUser <= 0) {
      return 'Requests per user must be greater than 0.';
    }

    if (
      config.maxRetries < 0 ||
      config.maxRetries > 10
    ) {
      return 'Maximum retries must be between 0 and 10.';
    }

    if (
      config.failureRate < 0 ||
      config.failureRate > 100
    ) {
      return 'Failure rate must be between 0% and 100%.';
    }

    if (!config.duration || config.duration <= 0) {
      return 'Simulation duration must be greater than 0.';
    }

    return '';
  };

  // =========================================================
  // Run simulation
  // =========================================================

  const handleRunSimulation = async () => {
    const error = validate();

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError('');
    setIsRunning(true);
    setResults(null);

    try {
      const simulationResult = await runSimulation({
        number_of_users: Number(config.users),

        // IMPORTANT:
        // This service must exist in the saved topology.
        service_name: 'Gateway',

        requests_per_user:
          Number(config.requestsPerUser),

        duration:
          Number(config.duration),

        failure_rate:
          Number(config.failureRate),

        max_retries:
          Number(config.maxRetries),

        backoff:
          config.backoff,

        base_retry_delay:
          Number(config.retryDelay),

        backoff_multiplier:
          config.backoff === 'exponential'
            ? 2
            : 1,

        jitter: false,

        timeout:
          Number(config.timeout || 1000)
      });

      // =====================================================
      // Store complete backend response
      // =====================================================

      setResults(simulationResult);

      // =====================================================
      // Save latest simulation
      // =====================================================

      const simulationId =
        simulationResult?.simulation?.simulation_id ||
        simulationResult?.simulation_id;

      if (simulationId) {
        localStorage.setItem(
          'lastSimulationId',
          String(simulationId)
        );

        localStorage.setItem(
          'retryscope_latest_simulation',
          JSON.stringify(simulationResult)
        );
      }

      setToastMessage(
        'Simulation completed successfully'
      );

    } catch (error) {
      console.error(
        'Simulation failed:',
        error
      );

      setValidationError(
        error?.message ||
        'Simulation failed. Please check the backend.'
      );

    } finally {
      setIsRunning(false);
    }
  };

  // =========================================================
  // Reset
  // =========================================================

  const handleReset = () => {
    if (isRunning) return;

    const confirmed = window.confirm(
      'Reset simulation configuration and clear results?'
    );

    if (!confirmed) return;

    setConfig(DEFAULT_SIMULATION_CONFIG);

    // Clear persisted configuration too
    localStorage.removeItem(
      'retryscope_simulation_config'
    );

    setResults(null);
    setValidationError('');
    setToastMessage(
      'Configuration reset to defaults'
    );
  };

  // =========================================================
  // Normalize service metrics
  //
  // Backend:
  //
  // service_metrics: {
  //   Gateway: {...},
  //   Inventory: {...},
  //   Database: {...}
  // }
  //
  // Frontend components:
  //
  // [
  //   { name: 'Gateway', ... },
  //   { name: 'Inventory', ... },
  //   { name: 'Database', ... }
  // ]
  // =========================================================

  const serviceResults = React.useMemo(() => {
    const metrics =
      results?.simulation?.service_metrics;

    if (!metrics) {
      return [];
    }

    // Already an array
    if (Array.isArray(metrics)) {
      return metrics;
    }

    // Backend object -> frontend array
    if (
      typeof metrics === 'object' &&
      metrics !== null
    ) {
      return Object.entries(metrics).map(
        ([name, serviceMetrics]) => ({
          name,
          ...serviceMetrics
        })
      );
    }

    return [];
  }, [results]);

  // =========================================================
  // Retry events
  // =========================================================

  const retryEvents =
    Array.isArray(
      results?.simulation?.retry_events
    )
      ? results.simulation.retry_events
      : [];

  // =========================================================
  // Selected simulation data
  // =========================================================

  const simulation =
    results?.simulation || null;

  return (
    <section className="simulation-page">

      {/* ===================================================
          Header
      =================================================== */}

      <div className="sim-header">

        <div>

          <h1 className="sim-header__title">
            Simulation
          </h1>

          <p className="sim-header__subtitle">
            Configure workload and retry behaviour
            before running a simulation.
          </p>

        </div>

        <div className="sim-header__actions">

          <button
            className="btn btn--secondary"
            onClick={handleReset}
            disabled={isRunning}
          >
            Reset
          </button>

          <button
            className="btn btn--primary"
            onClick={handleRunSimulation}
            disabled={isRunning}
          >
            {isRunning
              ? 'Running Simulation...'
              : 'Run Simulation'}
          </button>

        </div>

      </div>

      {/* ===================================================
          Toast
      =================================================== */}

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
            boxShadow:
              '0 8px 24px rgba(0,0,0,0.3)',
            zIndex: 9999,
            fontWeight: 500,
            fontSize: '0.875rem'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* ===================================================
          Error
      =================================================== */}

      {validationError && (
        <div className="sim-alert">

          <span>⚠</span>

          <span>
            {validationError}
          </span>

        </div>
      )}

      {/* ===================================================
          Configuration
      =================================================== */}

      <div className="sim-layout">

        <SimulationConfig
          config={config}
          onChange={handleConfigChange}
          isRunning={isRunning}
        />

        <SimulationPreview
          serviceResults={serviceResults}
          isRunning={isRunning}
        />

        <RetryConfiguration
          config={config}
          onChange={handleConfigChange}
          isRunning={isRunning}
        />

      </div>

      {/* ===================================================
          Status Banner
      =================================================== */}

      <div
        className={`sim-status-banner ${
          isRunning
            ? 'sim-status-banner--running'
            : results
            ? 'sim-status-banner--completed'
            : ''
        }`}
      >

        <div className="sim-status-content">

          <div
            className={`sim-status-indicator ${
              isRunning
                ? 'sim-status-indicator--running'
                : results
                ? 'sim-status-indicator--completed'
                : ''
            }`}
          />

          <div className="sim-status-text">

            <strong>
              {isRunning
                ? 'Simulation running...'
                : results
                ? 'Simulation Completed'
                : 'Ready for Simulation'}
            </strong>

            <small>
              {isRunning
                ? 'Dispatching virtual user requests and tracking retry cascades...'
                : results
                ? 'Simulation completed successfully'
                : 'Select workload parameters and execute simulation to inspect pressure.'}
            </small>

          </div>

        </div>

        {/* Amplification */}

        {simulation?.retry_amplification !==
          undefined && (

          <div
            style={{
              fontSize: '0.8125rem',
              color: '#94a3b8'
            }}
          >

            Amplification factor:{' '}

            <strong
              style={{
                color: '#60a5fa'
              }}
            >
              {Number(
                simulation.retry_amplification
              ).toFixed(2)}x
            </strong>

          </div>
        )}

      </div>

      {/* ===================================================
          Metrics
      =================================================== */}

      <SimulationMetrics
        results={simulation}
        isRunning={isRunning}
      />

      {/* ===================================================
          Results
      =================================================== */}

      <SimulationResults
        results={simulation}
        isRunning={isRunning}
      />

    </section>
  );
}

export default SimulationPage;

import React, { useState, useEffect } from 'react';
import './RiskPredictionPage.css';
import { DEFAULT_RISK_INPUTS } from './data/riskPredictionData';
import { getSimulationResult } from '../../services';
import {
  RiskInputs,
  RiskAssessment,
  RiskFactors,
  RiskBreakdown,
  Recommendations
} from './components';

function getRiskBadgeClass(level) {
  const normalizedLevel = String(level || 'LOW').toLowerCase();

  if (normalizedLevel === 'high') {
    return 'risk-badge--high';
  }

  if (
    normalizedLevel === 'medium' ||
    normalizedLevel === 'moderate'
  ) {
    return 'risk-badge--moderate';
  }

  return 'risk-badge--low';
}

function buildRecommendationsFromBackend(result) {
  const recommendation = result?.recommendation;

  if (!recommendation) {
    return [];
  }

  const simulation = result?.simulation ?? {};

  const currentMaxRetries = Number(simulation.max_retries ?? 0);
  const currentBackoff = simulation.backoff ?? 'exponential';
  const currentJitter = Boolean(simulation.jitter);
  const currentMultiplier = Number(
    simulation.backoff_multiplier ?? 1
  );

  const recommendations = [];

  if (recommendation.retry) {
    const recommendedMaxRetries =
      recommendation.retry.recommended_max_retries;

    const needsRetryReduction =
      recommendedMaxRetries != null &&
      recommendedMaxRetries < currentMaxRetries;

    recommendations.push({
      id: 'retry',
      title: 'Retry Configuration',
      current: `${currentMaxRetries} max retries`,
      recommended:
        recommendedMaxRetries == null
          ? 'No change required'
          : `${recommendedMaxRetries} max retries`,
      priority: needsRetryReduction
        ? 'High priority'
        : 'Low priority',
      priorityLevel: needsRetryReduction
        ? 'high'
        : 'medium',
      description: recommendation.retry.recommendation
    });
  }

  if (recommendation.backoff) {
    const recommendedMultiplier =
      Number(
        recommendation.backoff.recommended_backoff_multiplier ?? 1
      );

    recommendations.push({
      id: 'backoff',
      title: 'Backoff Configuration',
      current: `${currentBackoff} (${currentMultiplier}x)`,
      recommended: `Multiplier ${recommendedMultiplier}x`,
      priority: 'Medium priority',
      priorityLevel: 'medium',
      description: recommendation.backoff.recommendation
    });
  }

  if (recommendation.jitter) {
    const recommendedJitter =
      Boolean(recommendation.jitter.recommended_jitter);

    const needsJitter =
      recommendedJitter && !currentJitter;

    recommendations.push({
      id: 'jitter',
      title: 'Retry Jitter',
      current: currentJitter ? 'Enabled' : 'Disabled',
      recommended: recommendedJitter
        ? 'Enable jitter'
        : 'No change required',
      priority: needsJitter
        ? 'High priority'
        : 'Low priority',
      priorityLevel: needsJitter
        ? 'high'
        : 'medium',
      description: recommendation.jitter.recommendation
    });
  }

  if (recommendation.failure_handling) {
    const failureHandling =
      recommendation.failure_handling;

    const needsFailureHandling =
      Boolean(
        failureHandling.recommended_circuit_breaker ||
        failureHandling.recommended_dependency_isolation
      );

    const recommendedActions = [
      failureHandling.recommended_circuit_breaker
        ? 'Circuit breaker'
        : null,
      failureHandling.recommended_dependency_isolation
        ? 'Dependency isolation'
        : null
    ].filter(Boolean);

    recommendations.push({
      id: 'failure-handling',
      title: 'Failure Handling',
      current: 'Standard failure handling',
      recommended: needsFailureHandling
        ? recommendedActions.join(' + ')
        : 'No major changes required',
      priority: needsFailureHandling
        ? 'High priority'
        : 'Low priority',
      priorityLevel: needsFailureHandling
        ? 'high'
        : 'medium',
      description: failureHandling.recommendation
    });
  }

  return recommendations;
}

function buildAssessmentFromBackend(result) {
  const risk = result?.risk;

  if (!risk) {
    return null;
  }

  const retryRisk = Number(risk.retry_risk ?? 0);
  const failureRisk = Number(risk.failure_risk ?? 0);
  const cascadeRisk = Number(risk.cascade_risk ?? 0);
  const overallScore = Number(risk.overall_score ?? 0);
  const level = String(
    risk.risk_level ?? 'LOW'
  ).toUpperCase();

  return {
    score: overallScore,
    level,
    levelColor: level.toLowerCase(),
    badgeClass: getRiskBadgeClass(level),

    explanation:
      risk.risk_explanation ??
      'Risk assessment generated from the latest simulation.',

    // Real backend risk dimensions
    retryStormRisk: retryRisk,
    failureRisk,
    cascadingFailureRisk: cascadeRisk,

    factors: [
      {
        id: 'retry-risk',
        name: 'Retry Risk',
        value:
          retryRisk >= 70
            ? 'HIGH'
            : retryRisk >= 30
              ? 'MODERATE'
              : 'LOW',
        percent: retryRisk,
        description:
          'Risk caused by retry amplification in the simulation.'
      },
      {
        id: 'failure-risk',
        name: 'Failure Risk',
        value:
          failureRisk >= 70
            ? 'HIGH'
            : failureRisk >= 30
              ? 'MODERATE'
              : 'LOW',
        percent: failureRisk,
        description:
          'Risk caused by request failures in the simulation.'
      },
      {
        id: 'cascade-risk',
        name: 'Cascade Risk',
        value:
          cascadeRisk >= 70
            ? 'HIGH'
            : cascadeRisk >= 30
              ? 'MODERATE'
              : 'LOW',
        percent: cascadeRisk,
        description:
          'Risk caused by cascading failure events.'
      }
    ],

    recommendations:
      buildRecommendationsFromBackend(result)
  };
}

function RiskPredictionPage() {
  const [inputs, setInputs] = useState(DEFAULT_RISK_INPUTS);
  const [assessment, setAssessment] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadLatestRiskResult() {
      const simulationId =
        localStorage.getItem('lastSimulationId');

      if (!simulationId) {
        if (!cancelled) {
          setAssessment(null);
          setIsAnalyzing(false);
          setError(
            'No simulation result available. Run a simulation first.'
          );
        }

        return;
      }

      try {
        const result =
          await getSimulationResult(simulationId);

        if (cancelled) {
          return;
        }

        setSimulation(result?.simulation ?? null);
        const backendAssessment =
          buildAssessmentFromBackend(result);
        
          
        if (!backendAssessment) {
          throw new Error(
            'Risk data was not included in the simulation result.'
          );
        }

        setAssessment(backendAssessment);
        setError('');
        setToastMessage(
          'Latest backend risk result loaded'
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          'Failed to load risk result:',
          err
        );

        setAssessment(null);
        setError(
          err?.message ||
          'Failed to load risk result.'
        );
      } finally {
        if (!cancelled) {
          setIsAnalyzing(false);
        }
      }
    }

    loadLatestRiskResult();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(
        () => setToastMessage(''),
        3000
      );

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRunAnalysis = () => {
    setToastMessage(
      'Risk analysis uses the latest completed backend simulation.'
    );
  };

  const handleReset = () => {
    if (isAnalyzing) {
      return;
    }

    if (
      window.confirm(
        'Reset risk inputs to defaults?'
      )
    ) {
      setInputs(DEFAULT_RISK_INPUTS);

      setToastMessage(
        'Risk inputs reset to defaults'
      );
    }
  };

  return (
    <section className="risk-prediction-page">
      {/* Header */}
      <div className="rp-header">
        <div>
          <h1 className="rp-header__title">
            Risk Prediction
          </h1>

          <p className="rp-header__subtitle">
            Analyze retry-storm and cascading-failure
            risk before deployment.
          </p>
        </div>

        <div className="rp-header__actions">
          <button
            className="btn btn--secondary"
            onClick={handleReset}
            disabled={isAnalyzing}
          >
            Reset
          </button>

          <button
            className="btn btn--primary"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || !assessment}
          >
            {isAnalyzing
              ? 'Loading Risk...'
              : 'Run Risk Analysis'}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
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

      {error && (
        <div className="rp-panel">
          <div className="rp-panel__content">
            {error}
          </div>
        </div>
      )}

      {assessment && (
        <>
          {/* Top 3-Panel Layout */}
          <div className="rp-layout">
            <RiskInputs
              inputs={inputs}
              simulation={simulation}
              onChange={handleInputChange}
            />

            <RiskAssessment
              assessment={assessment}
            />

            <RiskFactors
              factors={assessment.factors}
            />
          </div>

          {/* Risk Breakdown Section */}
          <RiskBreakdown
            assessment={assessment}
          />

          {/* Recommendations Section */}
          <Recommendations
            recommendations={
              assessment.recommendations
            }
          />
        </>
      )}
    </section>
  );
}

export default RiskPredictionPage;


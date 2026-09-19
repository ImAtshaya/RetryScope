
// ============================================================
// SCENARIO CONFIGURATION
// ============================================================

export const SCENARIO_CONFIGS = {

  baseline: {
    id: 'baseline',
    name: 'Baseline',
    badge: 'Standard',
    badgeClass: 'scenario-badge--baseline',

    description:
      'Normal configuration without aggressive retry behaviour.',

    configuration: {
      maxRetries: '2 attempts',
      maxRetriesVal: 2,
      backoffStrategy: 'Exponential',
      retryDelay: '200 ms',
      timeout: '2,000 ms',
      jitter: false
    }
  },


  risky: {
    id: 'risky',
    name: 'Risky Configuration',
    badge: 'High Hazard',
    badgeClass: 'scenario-badge--risky',

    description:
      'High retry configuration that increases failure amplification.',

    configuration: {
      maxRetries: '8 attempts',
      maxRetriesVal: 8,
      backoffStrategy: 'Fixed',
      retryDelay: '50 ms',
      timeout: '5,000 ms',
      jitter: false
    }
  },


  recommended: {
    id: 'recommended',
    name: 'Recommended Configuration',
    badge: 'Optimal',
    badgeClass: 'scenario-badge--recommended',

    description:
      'Safer retry configuration designed to reduce cascading load.',

    configuration: {
      maxRetries: '3 attempts',
      maxRetriesVal: 3,
      backoffStrategy: 'Exponential + Jitter',
      retryDelay: '500 ms',
      timeout: '2,500 ms',
      jitter: true
    }
  }

};


// ============================================================
// EMPTY METRICS
// ============================================================

const EMPTY_METRICS = {

  totalRequests: 0,

  successfulRequests: 0,

  failedRequests: 0,

  retryAttempts: 0,

  retryAmplification: '1.000x',

  retryAmplificationVal: 1,

  failureRate: '0.0%',

  failureRateVal: 0,

  successRate: '0.0%',

  successRateVal: 0,

  overallRisk: 0,

  riskLevel: 'Not Run',

  riskClass: 'risk-low',

  evaluated: false

};


// ============================================================
// LIVE SCENARIOS
// ============================================================

export const SCENARIOS = {

  baseline: {
    ...SCENARIO_CONFIGS.baseline,

    metrics: {
      ...EMPTY_METRICS
    },

    configuration: {
      ...SCENARIO_CONFIGS.baseline.configuration
    },

    services: [],

    simulationId: null,

    riskId: null
  },


  risky: {
    ...SCENARIO_CONFIGS.risky,

    metrics: {
      ...EMPTY_METRICS
    },

    configuration: {
      ...SCENARIO_CONFIGS.risky.configuration
    },

    services: [],

    simulationId: null,

    riskId: null
  },


  recommended: {
    ...SCENARIO_CONFIGS.recommended,

    metrics: {
      ...EMPTY_METRICS
    },

    configuration: {
      ...SCENARIO_CONFIGS.recommended.configuration
    },

    services: [],

    simulationId: null,

    riskId: null
  }

};


// ============================================================
// HELPERS
// ============================================================

function round(value, decimals = 2) {

  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Number(
    number.toFixed(decimals)
  );

}


function formatPercent(
  value,
  decimals = 1
) {

  return `${round(
    value,
    decimals
  ).toFixed(decimals)}%`;

}


function formatAmplification(value) {

  return `${round(
    value,
    3
  ).toFixed(3)}x`;

}


function normalizeRiskLevel(level) {

  if (!level) {
    return 'Not Run';
  }

  const normalized =
    String(level).toUpperCase();

  if (normalized === 'HIGH') {
    return 'High';
  }

  if (normalized === 'MEDIUM') {
    return 'Medium';
  }

  if (normalized === 'LOW') {
    return 'Low';
  }

  return String(level);

}


// ============================================================
// SERVICE METRICS
// ============================================================

function buildServiceMetrics(
  simulationResult
) {

  const serviceMetrics =
    simulationResult?.service_metrics || {};

  return Object.entries(
    serviceMetrics
  ).map(
    ([name, metrics]) => {

      const requests =
        Number(
          metrics?.requests ??
          metrics?.total_requests ??
          0
        );


      const failed =
        Number(
          metrics?.failed ??
          metrics?.failed_requests ??
          0
        );


      const retries =
        Number(
          metrics?.retries ??
          metrics?.retry_attempts ??
          metrics?.total_retries ??
          0
        );


      const failureRate =
        Number(
          metrics?.failure_rate ??
          metrics?.failureRate
        );


      const calculatedFailureRate =
        Number.isFinite(failureRate)
          ? (
              failureRate <= 1
                ? failureRate * 100
                : failureRate
            )
          : (
              requests > 0
                ? (failed / requests) * 100
                : 0
            );


      const retryPressure =
        requests > 0
          ? (
              (requests + retries) /
              requests
            )
          : 1;


      let status = 'Healthy';


      if (
        calculatedFailureRate >= 20
      ) {

        status = 'Failed';

      } else if (
        calculatedFailureRate >= 10
      ) {

        status = 'Warning';

      }


      return {

        name,

        failureRate:
          formatPercent(
            calculatedFailureRate,
            1
          ),

        failureRateVal:
          round(
            calculatedFailureRate,
            2
          ),

        retryPressure:
          formatAmplification(
            retryPressure
          ),

        retryPressureVal:
          round(
            retryPressure,
            3
          ),

        status

      };

    }
  );

}


// ============================================================
// NORMALIZE PERCENTAGE
// Backend may return:
// 0.1  -> 10%
// 10   -> 10%
// ============================================================

function normalizePercentage(
  value
) {

  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  if (
    number >= 0 &&
    number <= 1
  ) {

    return number * 100;

  }

  return number;

}


// ============================================================
// UPDATE SCENARIO FROM BACKEND RESULT
// ============================================================

export function updateScenarioFromResult(
  scenarioKey,
  backendResult
) {

  if (!SCENARIOS[scenarioKey]) {

    console.error(
      `Unknown scenario key: ${scenarioKey}`
    );

    return null;
  }


  const simulation =
    backendResult?.simulation ||
    backendResult ||
    {};


  const risk =
    backendResult?.risk ||
    {};


  // ==========================================================
  // REQUEST COUNTS
  // ==========================================================

  const totalRequests =
    Number(
      simulation.original_requests ??
      simulation.total_requests ??
      simulation.totalRequests ??
      0
    );


  const completedRequests =
    Number(
      simulation.completed_requests ??
      simulation.completedRequests ??
      totalRequests
    );


  const successfulRequests =
    Number(
      simulation.successful_requests ??
      simulation.successfulRequests ??
      0
    );


  const failedRequests =
    Number(
      simulation.failed_requests ??
      simulation.failedRequests ??
      0
    );


  // ==========================================================
  // RETRIES
  // ==========================================================

  const retryAttempts =
    Number(
      simulation.total_retries ??
      simulation.retry_attempts ??
      simulation.retryAttempts ??
      0
    );


  // ==========================================================
  // AMPLIFICATION
  // ==========================================================

  let amplification =
    Number(
      simulation.retry_amplification_factor ??
      simulation.retry_amplification ??
      simulation.retryAmplification
    );


  if (
    !Number.isFinite(amplification)
  ) {

    amplification =
      totalRequests > 0
        ? (
            (totalRequests + retryAttempts) /
            totalRequests
          )
        : 1;

  }


  // ==========================================================
  // FAILURE RATE
  // ==========================================================

  let failureRate =
    normalizePercentage(
      simulation.failure_rate ??
      simulation.failureRate
    );


  if (
    failureRate === null
  ) {

    failureRate =
      completedRequests > 0
        ? (
            failedRequests /
            completedRequests
          ) * 100
        : 0;

  }


  // ==========================================================
  // SUCCESS RATE
  // ==========================================================

  let successRate =
    normalizePercentage(
      simulation.success_rate ??
      simulation.successRate
    );


  if (
    successRate === null
  ) {

    successRate =
      completedRequests > 0
        ? (
            successfulRequests /
            completedRequests
          ) * 100
        : 0;

  }


  // ==========================================================
  // RISK
  // ==========================================================

  let overallRisk =
    Number(
      risk.overall_score ??
      risk.overallScore ??
      0
    );


  // Protect against backend returning 0-1 risk
  if (
    overallRisk >= 0 &&
    overallRisk <= 1
  ) {

    overallRisk *= 100;

  }


  const riskLevel =
    normalizeRiskLevel(
      risk.risk_level ??
      risk.riskLevel
    );


  // ==========================================================
  // STORE REAL METRICS
  // ==========================================================

  SCENARIOS[scenarioKey].metrics = {

    totalRequests,

    successfulRequests,

    failedRequests,

    retryAttempts,

    retryAmplification:
      formatAmplification(
        amplification
      ),

    retryAmplificationVal:
      round(
        amplification,
        3
      ),

    failureRate:
      formatPercent(
        failureRate,
        1
      ),

    failureRateVal:
      round(
        failureRate,
        2
      ),

    successRate:
      formatPercent(
        successRate,
        1
      ),

    successRateVal:
      round(
        successRate,
        2
      ),

    overallRisk:
      round(
        overallRisk,
        2
      ),

    riskLevel,

    riskClass:
      overallRisk >= 50
        ? 'risk-high'
        : overallRisk >= 25
          ? 'risk-medium'
          : 'risk-low',

    evaluated: true

  };


  // ==========================================================
  // SERVICE DATA
  // ==========================================================

  SCENARIOS[scenarioKey].services =
    buildServiceMetrics(
      simulation
    );


  // ==========================================================
  // IDS
  // ==========================================================

  SCENARIOS[scenarioKey].simulationId =
    backendResult?.simulation_id ??
    simulation.simulation_id ??
    null;


  SCENARIOS[scenarioKey].riskId =
    backendResult?.risk_id ??
    risk.risk_id ??
    null;


  return SCENARIOS[scenarioKey];

}


// ============================================================
// RESET
// ============================================================

export function resetScenarios() {

  Object.keys(
    SCENARIO_CONFIGS
  ).forEach(
    scenarioKey => {

      SCENARIOS[scenarioKey].metrics = {
        ...EMPTY_METRICS
      };


      SCENARIOS[scenarioKey].configuration = {
        ...SCENARIO_CONFIGS[
          scenarioKey
        ].configuration
      };


      SCENARIOS[scenarioKey].services = [];


      SCENARIOS[scenarioKey].simulationId =
        null;


      SCENARIOS[scenarioKey].riskId =
        null;

    }
  );

}


// ============================================================
// DERIVED COMPARISON
// ============================================================

export function getDerivedRiskReduction() {

  const risky =
    SCENARIOS.risky.metrics;


  const recommended =
    SCENARIOS.recommended.metrics;


  const riskDifference =
    risky.overallRisk -
    recommended.overallRisk;


  const failureRateDifference =
    risky.failureRateVal -
    recommended.failureRateVal;


  const failedRequestsSaved =
    risky.failedRequests -
    recommended.failedRequests;


  const failedRequestsPctSaved =
    risky.failedRequests > 0
      ? (
          failedRequestsSaved /
          risky.failedRequests
        ) * 100
      : 0;


  const ampDifference =
    risky.retryAmplificationVal -
    recommended.retryAmplificationVal;


  const ampPctReduction =
    risky.retryAmplificationVal > 0
      ? (
          ampDifference /
          risky.retryAmplificationVal
        ) * 100
      : 0;


  return {

    riskReductionPts:
      round(
        riskDifference,
        2
      ),

    failureRateReductionPts:
      round(
        failureRateDifference,
        2
      ),

    failedRequestsSaved,

    failedRequestsPctSaved:
      round(
        failedRequestsPctSaved,
        1
      ),

    ampReduction:
      formatAmplification(
        Math.abs(
          ampDifference
        )
      ),

    ampPctReduction:
      round(
        Math.abs(
          ampPctReduction
        ),
        1
      ),

    recommendedImprovesRisk:
      riskDifference >= 0,

    recommendedImprovesFailureRate:
      failureRateDifference >= 0,

    recommendedImprovesAmplification:
      ampDifference >= 0

  };

}


// ============================================================
// ENGINEERING INSIGHT
// ============================================================

export function buildEngineeringInsight() {

  const baseline =
    SCENARIOS.baseline;


  const risky =
    SCENARIOS.risky;


  const recommended =
    SCENARIOS.recommended;


  const baselineMetrics =
    baseline.metrics;


  const riskyMetrics =
    risky.metrics;


  const recommendedMetrics =
    recommended.metrics;


  // ==========================================================
  // BEFORE RUN
  // ==========================================================

  if (
    !baselineMetrics.evaluated ||
    !riskyMetrics.evaluated ||
    !recommendedMetrics.evaluated
  ) {

    return {

      narrative:
        'Run the Baseline, Risky, and Recommended simulations to generate engineering insights from real backend results.',

      primaryFinding:
        'No comparison results available yet.',

      biggestImprovement:
        'No improvement can be calculated until all three scenarios are executed.',

      highestRiskScenario:
        'No scenario has been evaluated yet.',

      recommendedAction:
        'Run all three scenarios before making a retry-policy recommendation.'

    };

  }


  const reduction =
    getDerivedRiskReduction();


  // ==========================================================
  // FIND HIGHEST RISK
  // ==========================================================

  const evaluatedScenarios = [

    {
      key: 'baseline',
      scenario: baseline
    },

    {
      key: 'risky',
      scenario: risky
    },

    {
      key: 'recommended',
      scenario: recommended
    }

  ];


  const highestRisk =
    evaluatedScenarios.reduce(
      (highest, current) => {

        if (
          current.scenario.metrics.overallRisk >
          highest.scenario.metrics.overallRisk
        ) {

          return current;

        }

        return highest;

      }
    );


  // ==========================================================
  // IMPROVEMENT TEXT
  // ==========================================================

  let improvementText;


  if (
    reduction.recommendedImprovesAmplification
  ) {

    improvementText =
      `Retry amplification decreases from ${riskyMetrics.retryAmplification} to ${recommendedMetrics.retryAmplification} (${reduction.ampPctReduction}% reduction).`;

  } else {

    improvementText =
      `Retry amplification changes from ${riskyMetrics.retryAmplification} to ${recommendedMetrics.retryAmplification}; the recommended configuration should be reviewed against the simulation objective.`;

  }


  // ==========================================================
  // RISK FINDING
  // ==========================================================

  let primaryFinding;


  if (
    recommendedMetrics.overallRisk <
    riskyMetrics.overallRisk
  ) {

    primaryFinding =
      `Recommended configuration reduces overall risk from ${riskyMetrics.overallRisk.toFixed(2)}% to ${recommendedMetrics.overallRisk.toFixed(2)}%.`;

  } else if (
    recommendedMetrics.overallRisk >
    riskyMetrics.overallRisk
  ) {

    primaryFinding =
      `The recommended configuration currently has higher simulated risk (${recommendedMetrics.overallRisk.toFixed(2)}%) than the risky configuration (${riskyMetrics.overallRisk.toFixed(2)}%).`;

  } else {

    primaryFinding =
      `Risk is unchanged between the risky and recommended configurations at ${recommendedMetrics.overallRisk.toFixed(2)}%.`;

  }


  // ==========================================================
  // ACTION
  // ==========================================================

  let recommendedAction;


  if (
    recommendedMetrics.overallRisk <=
    riskyMetrics.overallRisk
  ) {

    recommendedAction =
      'Use the recommended retry policy before deployment and validate it with additional failure scenarios.';

  } else {

    recommendedAction =
      'Do not treat the recommended policy as safer yet; investigate the backend simulation parameters and rerun the comparison.';

  }


  return {

    narrative:
      `The risky configuration produced ${riskyMetrics.retryAmplification} retry amplification compared with ${recommendedMetrics.retryAmplification} for the recommended configuration. The recommended configuration produced an overall risk score of ${recommendedMetrics.overallRisk.toFixed(2)}% with a ${recommendedMetrics.failureRate} failure rate. The comparison is based on real simulation results returned by the backend.`,

    primaryFinding,

    biggestImprovement:
      improvementText,

    highestRiskScenario:
      `${highestRisk.scenario.name} (${highestRisk.scenario.configuration.maxRetries}, ${highestRisk.scenario.configuration.backoffStrategy}).`,

    recommendedAction

  };

}
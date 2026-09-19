export function getLatestSimulation() {

  try {

    const stored =
      localStorage.getItem(
        'retryscope_latest_simulation'
      )

    if (!stored) {
      return null
    }

    return JSON.parse(stored)

  } catch (error) {

    console.error(
      'Failed to load latest simulation:',
      error
    )

    return null
  }
}


/* =====================================================
   SIMULATION
===================================================== */

export function getSimulationData(
  result = null
) {

  const data =
    result ?? getLatestSimulation()

  if (!data) {
    return null
  }

  return data.simulation ?? data
}


/* =====================================================
   RISK
===================================================== */

export function getRiskData(
  result = null
) {

  const data =
    result ?? getLatestSimulation()

  if (!data) {
    return null
  }

  return data.risk ?? null
}


/* =====================================================
   RECOMMENDATION
===================================================== */

export function getRecommendationData(
  result = null
) {

  const data =
    result ?? getLatestSimulation()

  if (!data) {
    return null
  }

  return data.recommendation ?? null
}


/* =====================================================
   DASHBOARD METRICS
===================================================== */

export function getDashboardMetrics(
  result = null
) {

  const simulation =
    getSimulationData(result)

  const risk =
    getRiskData(result)


  if (!simulation) {

    return [

      {
        id: 'total-simulations',
        label: 'Total Simulations',
        value: '0',
        detail: 'No simulations yet',
        detailType: 'muted',
        icon: '◉',
      },

      {
        id: 'requests-tested',
        label: 'Requests Tested',
        value: '0',
        detail: 'No simulation data',
        detailType: 'muted',
        icon: '↗',
      },

      {
        id: 'average-risk',
        label: 'Failure Rate',
        value: '0.0%',
        detail: 'No simulation data',
        detailType: 'muted',
        icon: '!',
        iconVariant: 'warning',
      },

      {
        id: 'retry-amplification',
        label: 'Retry Amplification',
        value: '1.00x',
        detail: 'Baseline factor',
        detailType: 'muted',
        icon: '↻',
      },

    ]
  }


  const totalRequests =
    Number(
      simulation.total_requests ?? 0
    )


  const failedRequests =
    Number(
      simulation.failed_requests ?? 0
    )


  const totalRetries =
    Number(
      simulation.total_retries ?? 0
    )


  const amplification =
    Number(
      simulation.retry_amplification_factor ??
      (
        totalRequests > 0
          ? (
              totalRequests +
              totalRetries
            ) / totalRequests
          : 1
      )
    )


  const failureRate =
    totalRequests > 0
      ? (
          failedRequests /
          totalRequests
        ) * 100
      : 0


  return [

    {
      id: 'total-simulations',

      label: 'Latest Simulation',

      value: '1',

      detail: 'Simulation completed',

      detailType: 'positive',

      icon: '◉',
    },


    {
      id: 'requests-tested',

      label: 'Requests Tested',

      value:
        totalRequests.toLocaleString(),

      detail:
        'Latest simulation',

      detailType: 'muted',

      icon: '↗',
    },


    {
      id: 'average-risk',

      label: 'Failure Rate',

      value:
        `${failureRate.toFixed(1)}%`,

      detail:
        `${failedRequests.toLocaleString()} failed requests`,

      detailType:
        failureRate >= 10
          ? 'danger'
          : failureRate >= 5
          ? 'warning'
          : 'muted',

      icon: '!',

      iconVariant: 'warning',
    },


    {
      id: 'retry-amplification',

      label: 'Retry Amplification',

      value:
        `${amplification.toFixed(2)}x`,

      detail:
        `${totalRetries.toLocaleString()} retries`,

      detailType:
        amplification >= 1.5
          ? 'danger'
          : amplification > 1
          ? 'warning'
          : 'muted',

      icon: '↻',
    },

  ]
}


/* =====================================================
   TOPOLOGY
===================================================== */
export function getTopologyServices(result = null) {
  const storedTopology =
    localStorage.getItem('retryscope_latest_topology')

  if (!storedTopology) {
    return []
  }

  try {
    const topology = JSON.parse(storedTopology)

    if (!Array.isArray(topology.services)) {
      return []
    }

    const simulation =
      getSimulationData(result)

    const serviceMetrics =
      simulation?.service_metrics ?? {}

    return topology.services.map((name) => {
      const normalizedName =
        name.toLowerCase()

      let initial = 'S'
      let variant = 'service'

      if (normalizedName.includes('gateway')) {
        initial = 'G'
        variant = 'gateway'
      } else if (
        normalizedName.includes('database') ||
        normalizedName.includes('db')
      ) {
        initial = 'D'
        variant = 'database'
      } else if (
        normalizedName.includes('cache')
      ) {
        initial = 'C'
        variant = 'cache'
      } else {
        initial =
          name.charAt(0).toUpperCase()
      }

      const metrics =
        serviceMetrics[name] ?? {}

      const failures =
        Number(
          metrics.failed ??
          metrics.failures ??
          metrics.failed_requests ??
          0
        )

      return {
        id: name,
        initial,
        name,
        status:
          failures > 0
            ? 'Degraded'
            : 'Healthy',
        variant,
      }
    })
  } catch (error) {
    console.error(
      'Failed to load saved topology:',
      error
    )

    return []
  }
}

/* =====================================================
   DASHBOARD RISK
===================================================== */

export function getDashboardRisk(
  result = null
) {

  const risk =
    getRiskData(result)

  const simulation =
    getSimulationData(result)


  if (!risk) {

    return {

      level: 'N/A',

      score: 0,

      maxScore: 100,

      title: 'No Analysis',

      description:
        'Run a simulation to generate a risk assessment.',

      failureRate: '0.0%',

      retryFactor: '1.00x',

    }
  }


  const score =
    Number(
      risk.overall_score ?? 0
    )


  const level =
    risk.risk_level ??
    (
      score >= 70
        ? 'HIGH'
        : score >= 40
        ? 'MODERATE'
        : 'LOW'
    )


  const totalRequests =
    Number(
      simulation?.total_requests ?? 0
    )


  const failedRequests =
    Number(
      simulation?.failed_requests ?? 0
    )


  const totalRetries =
    Number(
      simulation?.total_retries ?? 0
    )


  const failureRate =
    totalRequests > 0
      ? (
          failedRequests /
          totalRequests
        ) * 100
      : 0


  const retryFactor =
    Number(
      simulation?.retry_amplification_factor ??
      (
        totalRequests > 0
          ? (
              totalRequests +
              totalRetries
            ) / totalRequests
          : 1
      )
    )


  return {

    level,

    score,

    maxScore: 100,

    title:
      level === 'HIGH'
        ? 'High Risk'
        : level === 'MODERATE'
        ? 'Moderate Risk'
        : 'Low Risk',

    description:
      risk.risk_explanation ??
      'Risk assessment generated from the latest simulation.',

    failureRate:
      `${failureRate.toFixed(1)}%`,

    retryFactor:
      `${retryFactor.toFixed(2)}x`,

  }
}


/* =====================================================
   RECENT SIMULATIONS
===================================================== */

export function getRecentSimulations(
  result = null
) {

  const simulation =
    getSimulationData(result)


  if (!simulation) {
    return []
  }


  const users =
    simulation.users ?? 0


  const requests =
    simulation.total_requests ?? 0


  const risk =
    getDashboardRisk(result)


  return [

    {

      id:
        simulation.simulation_id ??
        'latest-simulation',

      name:
        'Latest Simulation',

      timestamp:
        'Just now',

      users,

      requests:
        Number(requests)
          .toLocaleString(),

      risk:
        `${risk.score}%`,

      riskLevel:
        risk.score >= 70
          ? 'danger'
          : risk.score >= 40
          ? 'warning'
          : 'success',

      status:
        'Completed',

    },

  ]
}
import { useEffect, useState } from 'react'

import {
  HeroSection,
  MetricsSection,
  RecentSimulationsPanel,
  RiskAssessmentPanel,
  ServiceTopologyPanel,
} from './components'

import { getSimulationResult } from '../../services'

import './DashboardPage.css'

function DashboardPage({ onNavigate }) {
  const [latestSimulation, setLatestSimulation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadLatestSimulation = async () => {
      setIsLoading(true)
      setError('')

      try {
        // Get the latest simulation ID created by SimulationPage.
        const simulationId =
          localStorage.getItem('lastSimulationId')

        if (!simulationId) {
          if (isMounted) {
            setLatestSimulation(null)
            setError(
              'No simulation result found. Run a simulation first.'
            )
          }

          return
        }


        // Fetch the REAL persisted result from FastAPI/PostgreSQL.
        const response =
          await getSimulationResult(simulationId)


        if (!isMounted) return

        setLatestSimulation(response)

        // Keep the latest complete response cached locally.
        localStorage.setItem(
          'retryscope_latest_simulation',
          JSON.stringify(response)
        )
      } catch (err) {
        console.error(
          'DASHBOARD: Failed to load simulation:',
          err
        )

        if (!isMounted) return

        // Fallback to cached result if the backend is temporarily unavailable.
        const storedSimulation =
          localStorage.getItem(
            'retryscope_latest_simulation'
          )

        if (storedSimulation) {
          try {
            const parsedSimulation =
              JSON.parse(storedSimulation)

            setLatestSimulation(parsedSimulation)

            setError(
              'Showing cached simulation data. Backend result could not be refreshed.'
            )
          } catch (parseError) {
            console.error(
              'DASHBOARD: Failed to parse cached result:',
              parseError
            )

            setLatestSimulation(null)
            setError(
              'Unable to load simulation result.'
            )
          }
        } else {
          setLatestSimulation(null)
          setError(
            err?.message ||
            'Unable to load simulation result.'
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadLatestSimulation()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="dashboard">

      <HeroSection
        onNavigate={onNavigate}
      />

      {error && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.10)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            color: '#f59e0b',
            fontSize: '0.875rem',
          }}
        >
          ⚠ {error}
        </div>
      )}

      {isLoading && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(96, 165, 250, 0.10)',
            border: '1px solid rgba(96, 165, 250, 0.25)',
            color: '#60a5fa',
            fontSize: '0.875rem',
          }}
        >
          Loading latest simulation...
        </div>
      )}

      <MetricsSection
        simulation={latestSimulation?.simulation}
        risk={latestSimulation?.risk}
      />

      <div className="dashboard-grid">

        <ServiceTopologyPanel
          onNavigate={onNavigate}
          simulation={latestSimulation?.simulation}
        />

        <RiskAssessmentPanel
          simulation={latestSimulation?.simulation}
          risk={latestSimulation?.risk}
        />

      </div>

      <RecentSimulationsPanel
        simulation={latestSimulation?.simulation}
        risk={latestSimulation?.risk}
      />

    </div>
  )
}

export default DashboardPage
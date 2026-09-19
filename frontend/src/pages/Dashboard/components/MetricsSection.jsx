import { getDashboardMetrics } from '../data/dashboardData'
import MetricCard from './MetricCard'

function MetricsSection({ simulation }) {

  const metrics =
    getDashboardMetrics(simulation)


  return (

    <section className="dashboard-metrics">

      <header className="dashboard-section-heading">

        <div>

          <span className="dashboard-eyebrow">
            Overview
          </span>

          <h3 className="dashboard-section-heading__title">
            System Metrics
          </h3>

        </div>


        <span className="dashboard-section-heading__meta">
          Latest simulation
        </span>

      </header>


      <div className="dashboard-metrics__grid">

        {metrics.map(
          (metric) => (

            <MetricCard
              key={metric.id}
              {...metric}
            />

          )
        )}

      </div>

    </section>
  )
}

export default MetricsSection
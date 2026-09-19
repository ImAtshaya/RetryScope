import Panel from './Panel'

function RecentSimulationsPanel({
  simulation,
  risk
}) {

  const simulationData = simulation
    ? [{
        id: simulation.simulation_id || 'latest',
        name: 'Latest Simulation',
        timestamp: 'Just now',
        users: 
          simulation.users ??
          simulation.number_of_users ??
          '-',
        requests:
          simulation.total_requests?.toLocaleString() ?? '0',
        risk:
          risk?.overall_score != null
          ? `${risk.overall_score}%`
          : '-',

        riskLevel:
          risk?.overall_score >= 70
            ? 'danger'
            : risk?.overall_score >= 40
            ? 'warning'
            : 'success',      
        riskLevel:
          simulation.risk?.score >= 70
            ? 'danger'
            : simulation.risk?.score >= 40
            ? 'warning'
            : 'success',
        status: 'Completed',
      }]
    : []

  return (

    <Panel
      className="simulations-panel"
      eyebrow="Activity"
      title="Recent Simulations"
      action={
        <button
          type="button"
          className="dashboard-text-button"
        >
          View all →
        </button>
      }
    >

      <div className="simulation-table">

        <div className="simulation-table__header">

          <span>Simulation</span>
          <span>Users</span>
          <span>Requests</span>
          <span>Risk</span>
          <span>Status</span>

        </div>

        {simulationData.length === 0 ? (

          <div className="simulation-table__row">

            <span className="simulation-table__name">

              <strong>
                No simulations yet
              </strong>

              <small>
                Run a simulation to see results
              </small>

            </span>

            <span>-</span>
            <span>-</span>
            <span>-</span>
            <span>-</span>

          </div>

        ) : (

          simulationData.map((item) => (

            <div
              key={item.id}
              className="simulation-table__row"
            >

              <span className="simulation-table__name">

                <strong>
                  {item.name}
                </strong>

                <small>
                  {item.timestamp}
                </small>

              </span>

              <span>
                {item.users}
              </span>

              <span>
                {item.requests}
              </span>

              <span
                className={
                  `simulation-table__risk ` +
                  `simulation-table__risk--${item.riskLevel}`
                }
              >
                {item.risk}
              </span>

              <span className="status-badge status-badge--success">
                {item.status}
              </span>

            </div>

          ))

        )}

      </div>

    </Panel>

  )
}

export default RecentSimulationsPanel
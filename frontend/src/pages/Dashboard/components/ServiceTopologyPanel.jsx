import { PAGES } from '../../../utils/navigation'
import { getTopologyServices } from '../data/dashboardData'
import Panel from './Panel'

function ServiceTopologyPanel({
  onNavigate,
  simulation,
}) {

  const services =
    getTopologyServices(simulation)


  return (

    <Panel
      className="topology-panel"
      eyebrow="Architecture"
      title="Service Topology"
      action={

        <button
          type="button"
          className="dashboard-text-button"
          onClick={() =>
            onNavigate?.(PAGES.TOPOLOGY)
          }
        >
          Open Designer →
        </button>

      }
    >

      {services.length === 0 ? (

        <div
          style={{
            padding: '24px 0',
            textAlign: 'center',
            color: '#64748b',
          }}
        >

          No topology data available.

          <br />

          Run a simulation first.

        </div>

      ) : (

        <div className="topology-chain">

          {services.map(
            (service, index) => (

              <div
                key={service.id}
                className="topology-chain__group"
              >

                {index > 0 && (

                  <div
                    className="topology-chain__line"
                    aria-hidden="true"
                  />

                )}


                <div
                  className={
                    `topology-node ` +
                    `topology-node--${service.variant}`
                  }
                >

                  <span className="topology-node__initial">
                    {service.initial}
                  </span>


                  <strong className="topology-node__name">
                    {service.name}
                  </strong>


                  <small className="topology-node__status">
                    {service.status}
                  </small>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </Panel>

  )
}

export default ServiceTopologyPanel
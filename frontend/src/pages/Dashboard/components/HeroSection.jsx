import { PAGES } from '../../../utils/navigation'
import HeroVisual from './HeroVisual'

function HeroSection({ onNavigate }) {
  return (
    <section className="dashboard-hero">
      <div className="dashboard-hero__content">
        <span className="dashboard-eyebrow">Pre-Deployment Analysis</span>

        <h2 className="dashboard-hero__heading">
          Understand retry risk
          <br />
          <span className="dashboard-hero__heading-accent">before production.</span>
        </h2>

        <p className="dashboard-hero__description">
          Model microservice failures, simulate retry behaviour, and identify
          cascading failure risks before deployment.
        </p>

        <div className="dashboard-hero__actions">
          <button
            type="button"
            className="btn btn--primary btn--large"
            onClick={() => onNavigate?.(PAGES.SIMULATION)}
          >
            Run Simulation
            <span aria-hidden="true">→</span>
          </button>

          <button
            type="button"
            className="btn btn--secondary btn--large"
            onClick={() => onNavigate?.(PAGES.TOPOLOGY)}
          >
            Design Topology
          </button>
        </div>
      </div>

      <HeroVisual />
    </section>
  )
}

export default HeroSection

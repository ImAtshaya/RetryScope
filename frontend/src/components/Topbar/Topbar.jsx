import { PAGE_META, PAGES } from '../../utils/navigation'
import './Topbar.css'

function Topbar({ activePage, onNewSimulation }) {
  const meta = PAGE_META[activePage] ?? PAGE_META[PAGES.DASHBOARD]

  return (
    <header className="topbar">
      <div className="topbar__heading">
        <p className="topbar__breadcrumb">{meta.breadcrumb}</p>
        <h2 className="topbar__title">{meta.title}</h2>
      </div>

      <div className="topbar__actions">
        <div className="topbar__connection">
          <span className="status-dot status-dot--online" aria-hidden="true" />
          API Connected
        </div>

        <button type="button" className="btn btn--secondary">
          Settings
        </button>

        <button
          type="button"
          className="btn btn--primary"
          onClick={onNewSimulation}
        >
          + New Simulation
        </button>
      </div>
    </header>
  )
}

export default Topbar

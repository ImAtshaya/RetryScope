import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'
import './AppLayout.css'

function AppLayout({ activePage, onNavigate, onNewSimulation, children }) {
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="app-shell__main">
        <Topbar activePage={activePage} onNewSimulation={onNewSimulation} />
        <div className="app-shell__content">{children}</div>
      </div>
    </div>
  )
}

export default AppLayout

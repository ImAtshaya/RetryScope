import { useState } from 'react'
import './App.css'
import { AppLayout } from './layouts'
import { ComparisonPage } from './pages/Comparison'
import { DashboardPage } from './pages/Dashboard'
import { ExportReportPage } from './pages/ExportReport'
import { FaultInjectionPage } from './pages/FaultInjection'
import { RiskPredictionPage } from './pages/RiskPrediction'
import { SimulationPage } from './pages/Simulation'
import { TopologyDesignerPage } from './pages/TopologyDesigner'
import { VisualizationsPage } from './pages/Visualizations'
import { PAGES } from './utils/navigation'

const PAGE_COMPONENTS = {
  [PAGES.DASHBOARD]: DashboardPage,
  [PAGES.TOPOLOGY]: TopologyDesignerPage,
  [PAGES.FAULT_INJECTION]: FaultInjectionPage,
  [PAGES.SIMULATION]: SimulationPage,
  [PAGES.RISK_PREDICTION]: RiskPredictionPage,
  [PAGES.VISUALIZATIONS]: VisualizationsPage,
  [PAGES.COMPARISON]: ComparisonPage,
  [PAGES.EXPORT]: ExportReportPage,
}

function App() {
  const [activePage, setActivePage] = useState(PAGES.DASHBOARD)

  const ActivePage = PAGE_COMPONENTS[activePage] ?? DashboardPage

  const handleNewSimulation = () => {
    setActivePage(PAGES.SIMULATION)
  }

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={setActivePage}
      onNewSimulation={handleNewSimulation}
    >
      <ActivePage onNavigate={setActivePage} />
    </AppLayout>
  )
}

export default App

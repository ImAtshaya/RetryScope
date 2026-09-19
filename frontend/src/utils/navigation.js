export const PAGES = {
  DASHBOARD: 'dashboard',
  TOPOLOGY: 'topology',
  FAULT_INJECTION: 'fault-injection',
  SIMULATION: 'simulation',
  RISK_PREDICTION: 'risk-prediction',
  VISUALIZATIONS: 'visualizations',
  COMPARISON: 'comparison',
  EXPORT: 'export',
}

export const PAGE_META = {
  [PAGES.DASHBOARD]: {
    title: 'Dashboard',
    breadcrumb: 'Workspace / Overview',
  },
  [PAGES.TOPOLOGY]: {
    title: 'Topology Designer',
    breadcrumb: 'Workspace / Topology',
  },
  [PAGES.FAULT_INJECTION]: {
    title: 'Fault Injection',
    breadcrumb: 'Workspace / Fault Injection',
  },
  [PAGES.SIMULATION]: {
    title: 'Simulation',
    breadcrumb: 'Workspace / Simulation',
  },
  [PAGES.RISK_PREDICTION]: {
    title: 'Risk Prediction',
    breadcrumb: 'Analysis / Risk Prediction',
  },
  [PAGES.VISUALIZATIONS]: {
    title: 'Visualizations',
    breadcrumb: 'Analysis / Visualizations',
  },
  [PAGES.COMPARISON]: {
    title: 'Comparison',
    breadcrumb: 'Analysis / Comparison',
  },
  [PAGES.EXPORT]: {
    title: 'Export Report',
    breadcrumb: 'Output / Export',
  },
}

export const NAV_SECTIONS = [
  {
    title: 'Workspace',
    items: [
      { id: PAGES.DASHBOARD, label: 'Dashboard', icon: 'dashboard' },
      { id: PAGES.TOPOLOGY, label: 'Topology Designer', icon: 'topology' },
      { id: PAGES.FAULT_INJECTION, label: 'Fault Injection', icon: 'fault' },
      { id: PAGES.SIMULATION, label: 'Simulation', icon: 'simulation' },
    ],
  },
  {
    title: 'Analysis',
    items: [
      { id: PAGES.RISK_PREDICTION, label: 'Risk Prediction', icon: 'risk' },
      { id: PAGES.VISUALIZATIONS, label: 'Visualizations', icon: 'visualizations' },
      { id: PAGES.COMPARISON, label: 'Comparison', icon: 'comparison' },
    ],
  },
  {
    title: 'Output',
    items: [
      { id: PAGES.EXPORT, label: 'Export Report', icon: 'export' },
    ],
  },
]

const icons = {
  dashboard: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  topology: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3.5 16 7v6l-6 3.5L4 13V7l6-3.5Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  fault: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M11 2.5 4.5 11h4.5L9 17.5 15.5 9H11V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  simulation: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 5.5v9l7.5-4.5L7 5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  risk: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  visualizations: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3.5 15.5V8.5M8 15.5V4.5M12.5 15.5v-5M17 15.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  comparison: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12M4 10l3-3M4 10l3 3M16 10l-3-3M16 10l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  export: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3.5v9M10 12.5l3-3M10 12.5l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 16.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

function NavIcon({ name }) {
  return icons[name] ?? null
}

export default NavIcon

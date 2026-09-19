import { NAV_SECTIONS } from '../../utils/navigation'
import { NavigationItem } from '../NavigationItem'
import BrandLogo from './BrandLogo'
import './Sidebar.css'

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <BrandLogo />
        <div className="sidebar__brand-text">
          <h1 className="sidebar__title">RetryScope</h1>
          <span className="sidebar__subtitle">Risk Intelligence</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="sidebar__section">
            <p className="sidebar__section-title">{section.title}</p>
            <ul className="sidebar__section-list">
              {section.items.map((item) => (
                <li key={item.id}>
                  <NavigationItem
                    icon={item.icon}
                    label={item.label}
                    active={activePage === item.id}
                    onClick={() => onNavigate(item.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__status">
          <span className="status-dot status-dot--online" aria-hidden="true" />
          <div>
            <strong>System Online</strong>
            <span>Backend connected</span>
          </div>
        </div>
        <p className="sidebar__version">RetryScope v1.0</p>
      </div>
    </aside>
  )
}

export default Sidebar

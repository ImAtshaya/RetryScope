import NavIcon from './NavIcon'
import './NavigationItem.css'

function NavigationItem({ icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      className={`nav-item${active ? ' nav-item--active' : ''}`}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      <span className="nav-item__icon">
        <NavIcon name={icon} />
      </span>
      <span className="nav-item__label">{label}</span>
    </button>
  )
}

export default NavigationItem

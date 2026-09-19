function MetricCard({ label, value, detail, detailType = 'muted', icon, iconVariant }) {
  return (
    <article className="metric-card">
      <div className="metric-card__top">
        <span className="metric-card__label">{label}</span>
        <span
          className={`metric-card__icon${iconVariant ? ` metric-card__icon--${iconVariant}` : ''}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>

      <strong className="metric-card__value">{value}</strong>

      <span className={`metric-card__detail metric-card__detail--${detailType}`}>
        {detail}
      </span>
    </article>
  )
}

export default MetricCard

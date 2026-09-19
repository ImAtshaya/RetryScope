function Panel({ eyebrow, title, action, children, className = '' }) {
  return (
    <section className={`dashboard-panel ${className}`.trim()}>
      {(eyebrow || title || action) && (
        <header className="dashboard-panel__header">
          <div>
            {eyebrow && <span className="dashboard-eyebrow">{eyebrow}</span>}
            {title && <h3 className="dashboard-panel__title">{title}</h3>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export default Panel

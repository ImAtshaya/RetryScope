function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual__orbit hero-visual__orbit--one" />
      <div className="hero-visual__orbit hero-visual__orbit--two" />

      <div className="hero-visual__core">
        <span>R</span>
      </div>

      <div className="hero-visual__node hero-visual__node--one">API</div>
      <div className="hero-visual__node hero-visual__node--two">DB</div>
      <div className="hero-visual__node hero-visual__node--three">SVC</div>
    </div>
  )
}

export default HeroVisual

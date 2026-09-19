import React from 'react';

export function RetryCascade({ cascadeChain }) {
  return (
    <div className="viz-panel">
      <div className="viz-panel__header">
        <span>Retry Cascade & Propagation Flow</span>
        <span className="viz-panel__header-tag">Dependency Chain</span>
      </div>
      <div className="viz-panel__content">
        <div className="viz-cascade-flow">
          {cascadeChain.map((node, i) => {
            const isHigh = parseFloat(node.multiplier) > 2.5;

            return (
              <React.Fragment key={node.service}>
                <div
                  className={`viz-cascade-node ${node.isHighlighted ? 'viz-cascade-node--highlight' : ''}`}
                >
                  <span className="viz-cascade-node-name">{node.service}</span>
                  <span className="viz-cascade-node-role">{node.role}</span>
                  <span
                    className={`viz-cascade-node-mult ${isHigh ? 'viz-cascade-node-mult--high' : ''}`}
                  >
                    {node.multiplier} Load
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: 2 }}>
                    {node.failures}
                  </span>
                </div>

                {i < cascadeChain.length - 1 && (
                  <div className="viz-cascade-arrow">
                    <span style={{ fontSize: '0.6875rem', color: '#60a5fa', marginBottom: 2 }}>
                      Cascade
                    </span>
                    <div className="viz-cascade-arrow__line" />
                    <span>▶</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}

          <div className="viz-cascade-arrow">
            <div className="viz-cascade-arrow__line" style={{ background: '#ef4444' }} />
            <span style={{ color: '#ef4444' }}>▶</span>
          </div>

          <div
            className="viz-cascade-node"
            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.05)' }}
          >
            <span className="viz-cascade-node-name" style={{ color: '#f87171' }}>
              Outage / Drop
            </span>
            <span className="viz-cascade-node-role">Saturated queue</span>
            <span
              className="viz-cascade-node-mult viz-cascade-node-mult--high"
              style={{ background: 'rgba(239, 68, 68, 0.2)' }}
            >
              Exhausted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

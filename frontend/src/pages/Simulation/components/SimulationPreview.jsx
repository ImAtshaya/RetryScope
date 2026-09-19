import React from 'react';
import { DEFAULT_PREVIEW_NODES } from '../data/simulationData';

export function SimulationPreview({ serviceResults, isRunning }) {
  const getIcon = (type) => {
    switch (type) {
      case 'Gateway':
        return 'G';
      case 'Database':
        return 'D';
      case 'Cache':
        return 'C';
      case 'Service':
      default:
        return 'I';
    }
  };

  const getServiceStatus = (nodeId) => {
    if (!serviceResults) return 'Healthy';
    const found = serviceResults.find((s) => s.id === nodeId);
    return found ? found.status : 'Healthy';
  };

  return (
    <div className="sim-panel sim-preview-panel">
      <div className="sim-panel__header">
        <span>Simulation Preview</span>
        <span className="sim-panel__header-tag">Topology</span>
      </div>
      <div className="sim-panel__content sim-preview-canvas">
        <div className="sim-topology-chain">
          {DEFAULT_PREVIEW_NODES.map((node, index) => {
            const status = getServiceStatus(node.id);
            const statusClass = `sim-node-status--${status.toLowerCase()}`;
            const iconClass = `sim-node-icon--${node.id.toLowerCase()}`;

            return (
              <div key={node.id} className="sim-topology-step">
                <div className="sim-node-card">
                  <div className={`sim-node-icon ${iconClass}`}>{getIcon(node.type)}</div>
                  <div className="sim-node-info">
                    <span className="sim-node-name">{node.name}</span>
                    <span className="sim-node-type">{node.type}</span>
                  </div>
                  <span className={`sim-node-status ${statusClass}`}>
                    {isRunning ? 'Simulating...' : status}
                  </span>
                </div>

                {index < DEFAULT_PREVIEW_NODES.length - 1 && (
                  <div className="sim-connector-line">
                    <div className="sim-connector-line__bar" />
                    <div className="sim-connector-line__arrow">▼</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

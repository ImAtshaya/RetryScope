import React from 'react';

export function InjectionNode({ node, isTarget, activeFault }) {
  const getIcon = (type) => {
    switch (type) {
      case 'Gateway': return 'G';
      case 'Database': return 'D';
      case 'Cache': return 'C';
      case 'Service':
      default: return 'S';
    }
  };

  // Only apply visual effects if there is an active fault configured on this target
  const isFailed = activeFault && activeFault.faultType === 'service_failure';
  const isWarning = activeFault && activeFault.faultType !== 'service_failure';
  
  let nodeClass = 'fi-node';
  if (isTarget) nodeClass += ' fi-node--target';
  if (activeFault && isTarget) {
    if (isFailed) nodeClass += ' fi-node--failed';
    else nodeClass += ' fi-node--faulted';
  }

  let statusClass = `fi-node__status--${node.status.toLowerCase()}`;
  let statusText = node.status;
  
  // Override status visually based on fault
  if (activeFault && isTarget) {
    if (isFailed) {
      statusClass = 'fi-node__status--failed';
      statusText = 'Failed';
    } else if (isWarning) {
      statusClass = 'fi-node__status--warning';
      statusText = 'Warning';
    }
  }

  return (
    <div className={nodeClass} id={`fi-node-${node.id}`}>
      <div className="fi-node__icon">{getIcon(node.type)}</div>
      <div className="fi-node__name">{node.name}</div>
      <div className={`fi-node__status ${statusClass}`}>
        {statusText}
      </div>
      
      {activeFault && isTarget && (
        <div className={`fi-node__fault-indicator ${isFailed ? 'fi-node__fault-indicator--failed' : ''}`}>
          {activeFault.faultName}
        </div>
      )}
    </div>
  );
}

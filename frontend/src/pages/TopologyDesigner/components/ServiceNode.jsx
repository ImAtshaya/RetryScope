import React from 'react';

export function ServiceNode({ node, isSelected, onClick }) {
  const getIcon = (type) => {
    switch (type) {
      case 'Gateway': return 'G';
      case 'Database': return 'D';
      case 'Cache': return 'C';
      case 'Service':
      default: return 'S';
    }
  };

  const typeClass = `service-node--type-${node.type.toLowerCase()}`;
  const selectedClass = isSelected ? 'service-node--selected' : '';
  const statusClass = `service-node__status--${node.status.toLowerCase()}`;

  return (
    <div 
      className={`service-node ${typeClass} ${selectedClass}`}
      onClick={onClick}
      id={`node-${node.id}`}
    >
      <div className="service-node__icon">{getIcon(node.type)}</div>
      <div className="service-node__name">{node.name}</div>
      <div className={`service-node__status ${statusClass}`}>
        {node.status}
      </div>
    </div>
  );
}

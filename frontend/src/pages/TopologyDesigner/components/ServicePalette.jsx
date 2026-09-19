import React from 'react';

const SERVICES = [
  { type: 'Gateway', label: 'Gateway', icon: 'G' },
  { type: 'Service', label: 'Service', icon: 'S' },
  { type: 'Database', label: 'Database', icon: 'D' },
  { type: 'Cache', label: 'Cache', icon: 'C' }
];

export function ServicePalette({ onAddService }) {
  return (
    <div className="td-panel">
      <div className="td-panel__header">Services</div>
      <div className="td-panel__content">
        <div className="palette-list">
          {SERVICES.map((service) => (
            <div 
              key={service.type} 
              className="palette-item"
              onClick={() => onAddService(service.type)}
            >
              <div className="palette-item__icon">{service.icon}</div>
              <span>{service.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

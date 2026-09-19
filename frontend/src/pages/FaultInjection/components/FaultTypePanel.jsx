import React from 'react';
import { FaultTypeCard } from './FaultTypeCard';
import { FAULT_TYPES } from '../data/faultInjectionData';

export function FaultTypePanel({ selectedFaultId, onSelectFault }) {
  return (
    <div className="fi-panel">
      <div className="fi-panel__header">Fault Types</div>
      <div className="fi-panel__content">
        <div className="fault-type-list">
          {FAULT_TYPES.map(fault => (
            <FaultTypeCard
              key={fault.id}
              fault={fault}
              isSelected={selectedFaultId === fault.id}
              onClick={() => onSelectFault(fault.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export function FaultTypeCard({ fault, isSelected, onClick }) {
  const selectedClass = isSelected ? 'fault-type-card--selected' : '';
  
  return (
    <div className={`fault-type-card ${selectedClass}`} onClick={onClick}>
      <div className="fault-type-card__icon">{fault.icon}</div>
      <div className="fault-type-card__content">
        <div className="fault-type-card__title">{fault.title}</div>
        <div className="fault-type-card__desc">{fault.description}</div>
      </div>
    </div>
  );
}

import React from 'react';
import { TIME_RANGES, SERVICE_FILTERS } from '../data/visualizationData';

export function VisualizationFilters({ timeRange, onTimeRangeChange, selectedService, onServiceChange }) {
  return (
    <div className="viz-filter-bar">
      <div className="viz-filter-group">
        <span className="viz-filter-label">Time Window:</span>
        <div className="viz-filter-pills">
          {TIME_RANGES.map((tr) => (
            <button
              key={tr.id}
              className={`viz-filter-pill ${timeRange === tr.id ? 'viz-filter-pill--active' : ''}`}
              onClick={() => onTimeRangeChange(tr.id)}
            >
              {tr.label}
            </button>
          ))}
        </div>
      </div>

      <div className="viz-filter-group">
        <span className="viz-filter-label">Service Scope:</span>
        <select
          className="viz-filter-select"
          value={selectedService}
          onChange={(e) => onServiceChange(e.target.value)}
        >
          {SERVICE_FILTERS.map((sf) => (
            <option key={sf.id} value={sf.id}>
              {sf.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

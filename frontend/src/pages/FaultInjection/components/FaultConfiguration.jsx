import React from 'react';
import { FaultSummary } from './FaultSummary';

export function FaultConfiguration({ 
  nodes, 
  faultTypes,
  selectedNodeId, 
  onSelectNode,
  selectedFaultId,
  configuration,
  onConfigChange,
  onInject,
  isConfigured,
  isValid
}) {
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedFault = faultTypes.find(f => f.id === selectedFaultId);
  
  const handleNumChange = (e, min, max, key) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = min;
    onConfigChange(key, val);
  };

  const renderConfigFields = () => {
    switch (selectedFaultId) {
      case 'service_failure':
        return (
          <div className="fi-group">
            <label className="fi-label">Failure Duration (seconds)</label>
            <input 
              type="number" 
              className="fi-input" 
              min="1" max="300"
              value={configuration.service_failure.duration}
              onChange={(e) => handleNumChange(e, 1, 300, 'duration')}
            />
            <div style={{fontSize: '0.75rem', color: '#64748b', marginTop: '4px'}}>
              Min: 1s, Max: 300s
            </div>
          </div>
        );
      case 'timeout':
        return (
          <div className="fi-group">
            <label className="fi-label">Timeout Duration (ms)</label>
            <input 
              type="number" 
              className="fi-input" 
              min="100" max="30000"
              value={configuration.timeout.timeoutMs}
              onChange={(e) => handleNumChange(e, 100, 30000, 'timeoutMs')}
            />
            <div style={{fontSize: '0.75rem', color: '#64748b', marginTop: '4px'}}>
              Min: 100ms, Max: 30,000ms
            </div>
          </div>
        );
      case 'latency':
        return (
          <div className="fi-group">
            <label className="fi-label">Added Latency (ms)</label>
            <input 
              type="number" 
              className="fi-input" 
              min="1" max="30000"
              value={configuration.latency.latencyMs}
              onChange={(e) => handleNumChange(e, 1, 30000, 'latencyMs')}
            />
            <div style={{fontSize: '0.75rem', color: '#64748b', marginTop: '4px'}}>
              Min: 1ms, Max: 30,000ms
            </div>
          </div>
        );
      case 'error_rate':
        return (
          <div className="fi-group">
            <label className="fi-label">Error Percentage ({configuration.error_rate.percentage}%)</label>
            <input 
              type="range" 
              className="fi-range" 
              min="1" max="100"
              value={configuration.error_rate.percentage}
              onChange={(e) => onConfigChange('percentage', parseInt(e.target.value, 10))}
            />
            <div style={{fontSize: '0.75rem', color: '#64748b', marginTop: '4px'}}>
              1% to 100%
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getDurationText = () => {
    if (!selectedFaultId) return null;
    switch (selectedFaultId) {
      case 'service_failure': return `${configuration.service_failure.duration} seconds`;
      case 'timeout': return `${configuration.timeout.timeoutMs} ms`;
      case 'latency': return 'Continuous';
      case 'error_rate': return 'Continuous';
      default: return null;
    }
  };

  const getStatusText = () => {
    if (!isValid) return 'Invalid';
    if (isConfigured) return 'Configured';
    return 'Ready';
  };

  return (
    <div className="fi-panel">
      <div className="fi-panel__header">Fault Configuration</div>
      <div className="fi-panel__content">
        <div className="fi-config-form">
          <div className="fi-group">
            <label className="fi-label">Target Service</label>
            <select 
              className="fi-input"
              value={selectedNodeId}
              onChange={(e) => onSelectNode(e.target.value)}
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>
          
          <div className="fi-group">
            <label className="fi-label">Fault Type</label>
            <div className="fi-value">
              {selectedFault ? (
                <>
                  <span style={{color: '#60a5fa'}}>{selectedFault.icon}</span> 
                  {selectedFault.title}
                </>
              ) : 'Select a fault type'}
            </div>
          </div>
          
          {renderConfigFields()}
          
          <FaultSummary 
            targetName={selectedNode ? selectedNode.name : ''}
            faultName={selectedFault ? selectedFault.title : ''}
            duration={getDurationText()}
            status={getStatusText()}
          />
          
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <button 
              className="btn btn--primary" 
              style={{ width: '100%', padding: '12px' }}
              onClick={onInject}
              disabled={!isValid}
            >
              Inject Fault
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

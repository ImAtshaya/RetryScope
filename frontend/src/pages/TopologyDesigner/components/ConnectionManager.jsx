import React, { useState } from 'react';

export function ConnectionManager({ 
  node, 
  nodes, 
  connections, 
  onAddConnection, 
  onRemoveConnection 
}) {
  const [selectedTargetId, setSelectedTargetId] = useState('');

  // Find all current dependencies of this node
  const nodeDependencies = connections.filter(c => c.source === node.id);
  
  // Available nodes to connect to (not self, not already connected)
  const availableTargets = nodes.filter(n => {
    if (n.id === node.id) return false;
    if (nodeDependencies.some(d => d.target === n.id)) return false;
    return true;
  });

  const handleAdd = () => {
    if (selectedTargetId) {
      onAddConnection(node.id, selectedTargetId);
      setSelectedTargetId('');
    }
  };

  return (
    <div className="prop-group" style={{ marginTop: '12px' }}>
      <div className="prop-label" style={{ marginBottom: '8px' }}>Dependencies</div>
      
      {nodeDependencies.length > 0 ? (
        <div className="dep-list">
          {nodeDependencies.map(dep => {
            const targetNode = nodes.find(n => n.id === dep.target);
            return (
              <div key={dep.target} className="dep-item">
                <span>{targetNode ? targetNode.name : dep.target}</span>
                <button 
                  className="dep-remove"
                  onClick={() => onRemoveConnection(node.id, dep.target)}
                  title="Remove connection"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '12px' }}>
          No dependencies.
        </div>
      )}
      
      {availableTargets.length > 0 && (
        <div className="dep-add">
          <select 
            className="prop-input" 
            value={selectedTargetId}
            onChange={(e) => setSelectedTargetId(e.target.value)}
          >
            <option value="">Select service...</option>
            {availableTargets.map(target => (
              <option key={target.id} value={target.id}>
                {target.name}
              </option>
            ))}
          </select>
          <button 
            className="btn btn--secondary" 
            onClick={handleAdd}
            disabled={!selectedTargetId}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

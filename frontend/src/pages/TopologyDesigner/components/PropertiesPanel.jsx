import React from 'react';
import { ConnectionManager } from './ConnectionManager';

export function PropertiesPanel({ 
  node, 
  nodes,
  connections,
  onUpdateNode,
  onDeleteNode,
  onAddConnection,
  onRemoveConnection
}) {
  if (!node) {
    return (
      <div className="td-panel">
        <div className="td-panel__header">Service Properties</div>
        <div className="td-panel__content">
          <div className="properties-empty">
            Select a service to view its properties.
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdateNode(node.id, { [name]: value });
  };

  return (
    <div className="td-panel">
      <div className="td-panel__header">Service Properties</div>
      <div className="td-panel__content">
        <div className="properties-form">
          <div className="prop-group">
            <label className="prop-label">Service Name</label>
            <input 
              type="text" 
              name="name"
              className="prop-input" 
              value={node.name} 
              onChange={handleChange}
            />
          </div>
          
          <div className="prop-group">
            <label className="prop-label">Service Type</label>
            <div className="prop-value">{node.type}</div>
          </div>
          
          <div className="prop-group">
            <label className="prop-label">Status</label>
            <select 
              name="status"
              className="prop-input"
              value={node.status}
              onChange={handleChange}
            >
              <option value="Healthy">Healthy</option>
              <option value="Warning">Warning</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          
          <ConnectionManager 
            node={node}
            nodes={nodes}
            connections={connections}
            onAddConnection={onAddConnection}
            onRemoveConnection={onRemoveConnection}
          />
          
          <div className="prop-danger-zone">
            <button className="btn-danger" onClick={() => onDeleteNode(node.id)}>
              Delete Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

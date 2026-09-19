import React, { useState, useEffect } from 'react';
import './TopologyDesignerPage.css';
import { initialNodes, initialConnections } from './data/topologyData';
import { 
  ServicePalette, 
  TopologyCanvas, 
  PropertiesPanel 
} from './components';
import { validateTopology } from '../../services';

function TopologyDesignerPage() {
  const [nodes, setNodes] = useState(initialNodes);
  const [connections, setConnections] = useState(initialConnections);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleAddService = (type) => {
    // Generate unique ID
    const newId = `node-${Date.now()}`;
    
    // Find count of existing type to generate default name
    const count = nodes.filter(n => n.type === type).length;
    const newName = `${type} ${count + 1}`;
    
    const newNode = {
      id: newId,
      name: newName,
      type: type,
      status: 'Healthy'
    };
    
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newId);
  };

  const handleUpdateNode = (id, updates) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, ...updates } : node
    ));
  };

  const handleDeleteNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
    // Remove all connections associated with this node
    setConnections(connections.filter(c => c.source !== id && c.target !== id));
    
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    }
  };

  const handleAddConnection = (sourceId, targetId) => {
    // Prevent duplicate connection and self-connection
    if (sourceId === targetId) return;
    if (connections.some(c => c.source === sourceId && c.target === targetId)) return;
    
    setConnections([...connections, { source: sourceId, target: targetId }]);
  };

  const handleRemoveConnection = (sourceId, targetId) => {
    setConnections(connections.filter(
      c => !(c.source === sourceId && c.target === targetId)
    ));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the topology to default? All changes will be lost.')) {
      setNodes(initialNodes);
      setConnections(initialConnections);
      setSelectedNodeId(null);
    }
  };

 
  const handleSave = async () => {
  if (nodes.length === 0) {
    alert('Cannot save an empty topology.');
    return;
  }

  try {
    const result = await validateTopology(nodes, connections);

    localStorage.setItem(
      'retryscope_latest_topology',
      JSON.stringify(result)
    );

    setToastMessage('Topology validated successfully');
  } catch (error) {
    alert(`Topology validation failed: ${error.message}`);
  }
};

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  return (
    <section className="topology-designer">
      <div className="td-header">
        <div>
          <h1 className="td-header__title">Topology Designer</h1>
          <p className="td-header__subtitle">
            Design and configure your microservice architecture before running simulations.
          </p>
        </div>
        <div className="td-header__actions">
          <button className="btn btn--secondary" onClick={handleReset}>
            Reset
          </button>
          <button className="btn btn--primary" onClick={handleSave}>
            Save Topology
          </button>
        </div>
      </div>
      
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#22c55e',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 9999,
          fontWeight: 500
        }}>
          {toastMessage}
        </div>
      )}

      <div className="td-layout">
        <ServicePalette onAddService={handleAddService} />
        
        <TopologyCanvas 
          nodes={nodes}
          connections={connections}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />
        
        <PropertiesPanel 
          node={selectedNode}
          nodes={nodes}
          connections={connections}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onAddConnection={handleAddConnection}
          onRemoveConnection={handleRemoveConnection}
        />
      </div>
    </section>
  );
}

export default TopologyDesignerPage;

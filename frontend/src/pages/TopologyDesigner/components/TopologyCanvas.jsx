import React, { useRef, useState, useEffect } from 'react';
import { ServiceNode } from './ServiceNode';

export function TopologyCanvas({ nodes, connections, selectedNodeId, onSelectNode }) {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLines = connections.map(conn => {
        const sourceEl = document.getElementById(`node-${conn.source}`);
        const targetEl = document.getElementById(`node-${conn.target}`);
        
        if (!sourceEl || !targetEl) return null;
        
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        
        // Calculate centers relative to container
        const startX = sourceRect.left + sourceRect.width / 2 - containerRect.left;
        const startY = sourceRect.top + sourceRect.height / 2 - containerRect.top;
        const endX = targetRect.left + targetRect.width / 2 - containerRect.left;
        const endY = targetRect.top + targetRect.height / 2 - containerRect.top;
        
        return {
          id: `${conn.source}-${conn.target}`,
          startX,
          startY,
          endX,
          endY
        };
      }).filter(Boolean);
      
      setLines(newLines);
    };

    updateLines();
    
    // Quick and dirty resize listener
    window.addEventListener('resize', updateLines);
    // Let DOM update before measuring
    const timeout = setTimeout(updateLines, 50);
    
    return () => {
      window.removeEventListener('resize', updateLines);
      clearTimeout(timeout);
    };
  }, [nodes, connections]);

  return (
    <div className="td-panel td-canvas" ref={containerRef}>
      <svg className="td-connections">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" opacity="0.6" />
          </marker>
        </defs>
        {lines.map(line => (
          <line
            key={line.id}
            x1={line.startX}
            y1={line.startY}
            x2={line.endX}
            y2={line.endY}
            className="td-connection-line"
            markerEnd="url(#arrowhead)"
          />
        ))}
      </svg>
      
      <div className="td-canvas-inner">
        {nodes.map(node => (
          <ServiceNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onClick={() => onSelectNode(node.id)}
          />
        ))}
      </div>
    </div>
  );
}

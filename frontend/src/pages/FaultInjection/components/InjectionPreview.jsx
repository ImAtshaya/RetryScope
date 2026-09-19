import React, { useRef, useState, useEffect } from 'react';
import { InjectionNode } from './InjectionNode';

export function InjectionPreview({ nodes, connections, targetNodeId, activeFault }) {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLines = connections.map(conn => {
        const sourceEl = document.getElementById(`fi-node-${conn.source}`);
        const targetEl = document.getElementById(`fi-node-${conn.target}`);
        
        if (!sourceEl || !targetEl) return null;
        
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        
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
    window.addEventListener('resize', updateLines);
    const timeout = setTimeout(updateLines, 50);
    
    return () => {
      window.removeEventListener('resize', updateLines);
      clearTimeout(timeout);
    };
  }, [nodes, connections]);

  return (
    <div className="fi-panel fi-canvas" ref={containerRef}>
      <svg className="fi-connections">
        <defs>
          <marker id="fi-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#475569" opacity="0.5" />
          </marker>
        </defs>
        {lines.map(line => (
          <line
            key={line.id}
            x1={line.startX}
            y1={line.startY}
            x2={line.endX}
            y2={line.endY}
            className="fi-connection-line"
            markerEnd="url(#fi-arrowhead)"
          />
        ))}
      </svg>
      
      <div className="fi-canvas-inner">
        {nodes.map(node => (
          <InjectionNode
            key={node.id}
            node={node}
            isTarget={targetNodeId === node.id}
            activeFault={activeFault && activeFault.target === node.id ? activeFault : null}
          />
        ))}
      </div>
    </div>
  );
}

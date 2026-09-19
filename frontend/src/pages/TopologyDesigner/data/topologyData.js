export const initialNodes = [
  { id: 'node-1', name: 'Gateway', type: 'Gateway', status: 'Healthy' },
  { id: 'node-2', name: 'Inventory', type: 'Service', status: 'Healthy' },
  { id: 'node-3', name: 'Database', type: 'Database', status: 'Healthy' }
];

export const initialConnections = [
  { source: 'node-1', target: 'node-2' },
  { source: 'node-2', target: 'node-3' }
];

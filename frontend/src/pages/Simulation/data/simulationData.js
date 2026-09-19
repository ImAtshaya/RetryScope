export const DEFAULT_SIMULATION_CONFIG = {
  users: 100,
  requestsPerUser: 10,
  duration: 30,
  failureRate: 5,
  maxRetries: 3,
  backoff: 'exponential',
  retryDelay: 100,
  timeout: 1000
};

export const DEFAULT_PREVIEW_NODES = [
  { id: 'gateway', name: 'Gateway', type: 'Gateway', status: 'Healthy' },
  { id: 'inventory', name: 'Inventory', type: 'Service', status: 'Healthy' },
  { id: 'database', name: 'Database', type: 'Database', status: 'Healthy' }
];


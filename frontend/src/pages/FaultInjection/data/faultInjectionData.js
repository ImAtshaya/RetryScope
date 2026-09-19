export const DEFAULT_TOPOLOGY_NODES = [
{ id: 'node-1', name: 'Gateway', type: 'Gateway', status: 'Healthy' },
{ id: 'node-2', name: 'Inventory', type: 'Service', status: 'Healthy' },
{ id: 'node-3', name: 'Database', type: 'Database', status: 'Healthy' }
];

export const DEFAULT_TOPOLOGY_CONNECTIONS = [
{ source: 'node-1', target: 'node-2' },
{ source: 'node-2', target: 'node-3' }
];

export const FAULT_TYPES = [
{
id: 'service_failure',
title: 'Service Failure',
description: 'Completely make the selected service unavailable.',
icon: '✕'
},
{
id: 'timeout',
title: 'Timeout',
description: 'Simulate delayed responses from the selected service.',
icon: '⏱'
},
{
id: 'latency',
title: 'High Latency',
description: 'Add artificial latency to service responses.',
icon: '〰'
},
{
id: 'error_rate',
title: 'Error Rate',
description: 'Increase the percentage of failed requests.',
icon: '⚠'
}
];

export const DEFAULT_CONFIG = {
service_failure: { duration: 30 },
timeout: { timeoutMs: 5000 },
latency: { latencyMs: 1000 },
error_rate: { percentage: 50 }
};

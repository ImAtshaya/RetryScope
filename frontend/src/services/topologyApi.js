import api from './api';

export function validateTopology(nodes, connections) {
  const nodeNameMap = new Map(
    nodes.map((node) => [node.id, node.name])
  );

  return api.post('/topology/validate', {
    services: nodes.map((node) => node.name),

    dependencies: connections.map((connection) => [
      nodeNameMap.get(connection.source),
      nodeNameMap.get(connection.target),
    ]),
  });
}
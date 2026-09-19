import api from './api';

export function getSimulationResult(simulationId) {
  return api.get(`/result/${simulationId}`);
}
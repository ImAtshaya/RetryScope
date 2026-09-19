import api from './api';

const FAULT_TYPE_MAP = {
  service_failure: 'failure',
  timeout: 'timeout',
  latency: 'latency',
  error_rate: 'error_rate',
};

export function injectFault(service, faultType, config) {
  const requestBody = {
    service,
    fault_type: FAULT_TYPE_MAP[faultType] || faultType,
    duration: config.duration || 30,
  };

  if (faultType === 'timeout') {
    requestBody.timeout_ms = config.timeoutMs;
  }

  if (faultType === 'latency') {
    requestBody.latency_ms = config.latencyMs;
  }

  if (faultType === 'error_rate') {
    requestBody.error_percentage = config.percentage;
  }

  return api.post('/fault-injection/inject', requestBody);
}
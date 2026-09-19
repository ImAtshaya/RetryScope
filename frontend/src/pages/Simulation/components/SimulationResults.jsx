import React from 'react';
import { ServiceStatusTable } from './ServiceStatusTable';
import { SimulationActivity } from './SimulationActivity';

export function SimulationResults({ results, isRunning }) {
  if (isRunning) {
    return (
      <div className="sim-empty-card">
        <div
          className="sim-status-indicator sim-status-indicator--running"
          style={{ width: 16, height: 16 }}
        />

        <h3 className="sim-empty-card__title">
          Executing Simulation Workload...
        </h3>

        <p className="sim-empty-card__text">
          Dispatching virtual user requests, evaluating retry policies, and
          tracking downstream pressure.
        </p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="sim-empty-card">
        <div className="sim-empty-card__icon">⚡</div>

        <h3 className="sim-empty-card__title">
          No simulation has been run yet
        </h3>

        <p className="sim-empty-card__text">
          Configure the virtual users, failure rate, and retry policies above,
          then click <strong>Run Simulation</strong>.
        </p>
      </div>
    );
  }

  // results is already the simulation object
  const services = Object.entries(
    results?.service_metrics || {}
  ).map(([name, metrics]) => ({
    name,
    ...metrics
  }));

  // Build activity from real backend simulation data.
  const activity = [];

  // 1. Simulation started
  activity.push({
    id: 'activity-start',
    message: 'Simulation workload initialized',
    type: 'info'
  });

  // 2. Workload dispatched
  const totalRequests = Number(results?.total_requests || 0);

  activity.push({
    id: 'activity-workload',
    message: `Dispatched ${totalRequests.toLocaleString()} requests across the configured virtual users`,
    type: 'info'
  });

  // 3. Retry events from backend
  const retryEvents = Array.isArray(results?.retry_events)
    ? results.retry_events
    : [];

  retryEvents.forEach((event, index) => {
    activity.push({
      id: `retry-${index}`,
      message:
        event?.reason
          ? `Retry triggered: ${event.reason}`
          : 'Retry attempt triggered',
      service: event?.service,
      timestamp:
        event?.time !== undefined
          ? `${Number(event.time).toFixed(2)}s`
          : undefined,
      type: 'warning'
    });
  });

  // 4. Latency events from backend
  const latencyEvents = Array.isArray(results?.latency_events)
    ? results.latency_events
    : [];

  latencyEvents.forEach((event, index) => {
    activity.push({
      id: `latency-${index}`,
      message: `Latency fault: ${event?.latency_ms || 0}ms`,
      service: event?.service,
      timestamp:
        event?.time !== undefined
          ? `${Number(event.time).toFixed(2)}s`
          : undefined,
      type: 'warning'
    });
  });

  // 5. Timeout events from backend
  const timeoutEvents = Array.isArray(results?.timeout_events)
    ? results.timeout_events
    : [];

  timeoutEvents.forEach((event, index) => {
    activity.push({
      id: `timeout-${index}`,
      message: `Timeout occurred: ${event?.timeout_ms || 0}ms`,
      service: event?.service,
      timestamp:
        event?.time !== undefined
          ? `${Number(event.time).toFixed(2)}s`
          : undefined,
      type: 'warning'
    });
  });

  // 6. Error-rate events from backend
  const errorRateEvents = Array.isArray(results?.error_rate_events)
    ? results.error_rate_events
    : [];

  errorRateEvents.forEach((event, index) => {
    activity.push({
      id: `error-rate-${index}`,
      message: 'Error-rate fault triggered',
      service: event?.service,
      timestamp:
        event?.time !== undefined
          ? `${Number(event.time).toFixed(2)}s`
          : undefined,
      type: 'warning'
    });
  });

  // 7. Cascade events from backend
  const cascadeEvents = Array.isArray(results?.cascade_events)
    ? results.cascade_events
    : [];

  cascadeEvents.forEach((event, index) => {
    activity.push({
      id: `cascade-${index}`,
      message: `Cascade detected: ${event?.failed_service || 'downstream service'} affected ${event?.affected_service || 'service'}`,
      service: event?.affected_service,
      timestamp:
        event?.time !== undefined
          ? `${Number(event.time).toFixed(2)}s`
          : undefined,
      type: 'warning'
    });
  });

  // 8. Simulation completed
  const successfulRequests = Number(
    results?.successful_requests || 0
  );

  const failedRequests = Number(
    results?.failed_requests || 0
  );

  activity.push({
    id: 'activity-complete',
    message: `Simulation completed: ${successfulRequests.toLocaleString()} succeeded, ${failedRequests.toLocaleString()} failed`,
    type: 'success'
  });

  return (
    <div className="sim-results-grid">
      <ServiceStatusTable services={services} />

      <SimulationActivity
        activity={activity}
      />
    </div>
  );
}

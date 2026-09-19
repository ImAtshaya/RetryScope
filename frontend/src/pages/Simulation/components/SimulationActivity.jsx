import React from 'react';

export function SimulationActivity({ activity }) {
  const safeActivity = Array.isArray(activity) ? activity : [];

  return (
    <div className="sim-panel">
      <div className="sim-panel__header">
        <span>Simulation Activity</span>
        <span className="sim-panel__header-tag">Live Trace</span>
      </div>

      <div className="sim-panel__content">
        {safeActivity.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: '#64748b'
            }}
          >
            No simulation activity available.
          </div>
        ) : (
          <div className="sim-activity-list">
            {safeActivity.map((item, index) => (
              <div
                key={item?.id || index}
                className="sim-activity-item"
              >
                <div className="sim-activity-item__indicator" />

                <div className="sim-activity-item__content">
                  <div className="sim-activity-item__title">
                    {item?.message ||
                      item?.event ||
                      item?.action ||
                      'Simulation event'}
                  </div>

                  {item?.service && (
                    <div className="sim-activity-item__service">
                      Service: {item.service}
                    </div>
                  )}

                  {item?.timestamp && (
                    <div className="sim-activity-item__time">
                      {item.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
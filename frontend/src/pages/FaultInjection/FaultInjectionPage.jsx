import React, { useState, useEffect } from 'react';
import './FaultInjectionPage.css';
import {
  DEFAULT_TOPOLOGY_NODES,
  DEFAULT_TOPOLOGY_CONNECTIONS,
  DEFAULT_CONFIG,
  FAULT_TYPES
} from './data/faultInjectionData';
import {
  FaultTypePanel,
  InjectionPreview,
  FaultConfiguration
} from './components';
import { injectFault } from '../../services';

const FAULT_CONFIG_STORAGE_KEY =
  'retryscope_fault_injection_config';

function FaultInjectionPage() {
  const [nodes, setNodes] = useState(DEFAULT_TOPOLOGY_NODES);
  const [connections, setConnections] = useState(
    DEFAULT_TOPOLOGY_CONNECTIONS
  );

  const [selectedFaultId, setSelectedFaultId] =
    useState('service_failure');

  const [selectedNodeId, setSelectedNodeId] =
    useState(
      DEFAULT_TOPOLOGY_NODES.find(
        (node) => node.name === 'Inventory'
      )?.id ||
        DEFAULT_TOPOLOGY_NODES[0]?.id ||
        ''
    );

  const [configuration, setConfiguration] =
    useState(DEFAULT_CONFIG);

  const [activeFault, setActiveFault] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const [settingsLoaded, setSettingsLoaded] =
    useState(false);

  /*
   * Load the latest topology.
   */
  useEffect(() => {
    try {
      const savedTopology = localStorage.getItem(
        'retryscope_latest_topology'
      );

      if (!savedTopology) {
        return;
      }

      const topology = JSON.parse(savedTopology);

      if (
        !Array.isArray(topology?.services) ||
        !Array.isArray(topology?.dependencies)
      ) {
        return;
      }

      const topologyNodes = topology.services.map(
        (service, index) => ({
          id: `topology-node-${index + 1}`,
          name: service,
          type:
            service.toLowerCase() === 'gateway'
              ? 'Gateway'
              : service.toLowerCase() === 'database'
                ? 'Database'
                : 'Service',
          status: 'Healthy'
        })
      );

      const serviceIdMap = new Map(
        topologyNodes.map((node) => [
          node.name,
          node.id
        ])
      );

      const topologyConnections =
        topology.dependencies
          .filter(
            (dependency) =>
              Array.isArray(dependency) &&
              dependency.length === 2 &&
              serviceIdMap.has(dependency[0]) &&
              serviceIdMap.has(dependency[1])
          )
          .map(([source, target]) => ({
            source: serviceIdMap.get(source),
            target: serviceIdMap.get(target)
          }));

      if (topologyNodes.length > 0) {
        setNodes(topologyNodes);
        setConnections(topologyConnections);

        const savedFaultConfig =
          localStorage.getItem(
            FAULT_CONFIG_STORAGE_KEY
          );

        let savedNodeId = null;

        if (savedFaultConfig) {
          try {
            const savedState = JSON.parse(
              savedFaultConfig
            );

            savedNodeId =
              savedState?.selectedNodeId || null;
          } catch {
            savedNodeId = null;
          }
        }

        const savedNodeExists =
          topologyNodes.some(
            (node) => node.id === savedNodeId
          );

        const preferredNode =
          (savedNodeExists &&
            topologyNodes.find(
              (node) => node.id === savedNodeId
            )) ||
          topologyNodes.find(
            (node) => node.name === 'Inventory'
          ) ||
          topologyNodes[0];

        setSelectedNodeId(
          preferredNode?.id || ''
        );
      }
    } catch (error) {
      console.error(
        'Failed to load saved topology:',
        error
      );
    }
  }, []);

  /*
   * Load previously saved Fault Injection settings.
   */
  useEffect(() => {
    const savedFaultConfig =
      localStorage.getItem(
        FAULT_CONFIG_STORAGE_KEY
      );

    if (!savedFaultConfig) {
      setSettingsLoaded(true);
      return;
    }

    try {
      const savedState =
        JSON.parse(savedFaultConfig);

      if (savedState?.selectedFaultId) {
        setSelectedFaultId(
          savedState.selectedFaultId
        );
      }

      if (savedState?.selectedNodeId) {
        setSelectedNodeId(
          savedState.selectedNodeId
        );
      }

      if (savedState?.configuration) {
        setConfiguration(
          savedState.configuration
        );
      }
    } catch {
      localStorage.removeItem(
        FAULT_CONFIG_STORAGE_KEY
      );
    }

    setSettingsLoaded(true);
  }, []);

  /*
   * Persist the CURRENT Fault Injection settings.
   *
   * This runs whenever the actual state changes.
   */
  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }

    localStorage.setItem(
      FAULT_CONFIG_STORAGE_KEY,
      JSON.stringify({
        selectedFaultId,
        selectedNodeId,
        configuration
      })
    );
  }, [
    settingsLoaded,
    selectedFaultId,
    selectedNodeId,
    configuration
  ]);

  /*
   * Existing toast behaviour.
   */
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(
        () => setToastMessage(''),
        3000
      );

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  /*
   * Change fault configuration.
   */
  const handleConfigChange = (key, value) => {
    setConfiguration((prev) => ({
      ...prev,
      [selectedFaultId]: {
        ...prev[selectedFaultId],
        [key]: value
      }
    }));

    setActiveFault(null);
  };

  /*
   * Change selected fault type.
   */
  const handleSelectFault = (id) => {
    setSelectedFaultId(id);
    setActiveFault(null);
  };

  /*
   * Change selected service.
   */
  const handleSelectNode = (id) => {
    setSelectedNodeId(id);
    setActiveFault(null);
  };

  /*
   * Reset Fault Injection settings.
   */
  const handleReset = () => {
    if (
      window.confirm(
        'Reset fault configuration to defaults?'
      )
    ) {
      setSelectedFaultId('service_failure');

      const preferredNode =
        nodes.find(
          (node) => node.name === 'Inventory'
        ) || nodes[0];

      setSelectedNodeId(
        preferredNode?.id || ''
      );

      setConfiguration(DEFAULT_CONFIG);

      localStorage.removeItem(
        FAULT_CONFIG_STORAGE_KEY
      );

      setActiveFault(null);
    }
  };

  const validateConfig = () => {
    if (!selectedNodeId || !selectedFaultId) {
      return false;
    }

    const config =
      configuration[selectedFaultId];

    if (!config) {
      return false;
    }

    if (
      selectedFaultId === 'service_failure' &&
      (config.duration < 1 ||
        config.duration > 300)
    ) {
      return false;
    }

    if (
      selectedFaultId === 'timeout' &&
      (config.timeoutMs < 100 ||
        config.timeoutMs > 30000)
    ) {
      return false;
    }

    if (
      selectedFaultId === 'latency' &&
      (config.latencyMs < 1 ||
        config.latencyMs > 30000)
    ) {
      return false;
    }

    if (
      selectedFaultId === 'error_rate' &&
      (config.percentage < 1 ||
        config.percentage > 100)
    ) {
      return false;
    }

    return true;
  };

  const handlePrepareInjection = () => {
    if (!validateConfig()) {
      alert(
        'Invalid configuration. Please check your inputs.'
      );
      return;
    }

    setToastMessage(
      'Fault configuration prepared locally'
    );
  };

  const handleInjectFault = async () => {
    if (!validateConfig()) {
      return;
    }

    const faultTypeObj = FAULT_TYPES.find(
      (fault) => fault.id === selectedFaultId
    );

    try {
      const config =
        configuration[selectedFaultId];

      const service = nodes.find(
        (node) => node.id === selectedNodeId
      )?.name;

      if (!service) {
        alert(
          'Selected service could not be found.'
        );
        return;
      }

      const result = await injectFault(
        service,
        selectedFaultId,
        config
      );

      setActiveFault({
        target: selectedNodeId,
        faultType: selectedFaultId,
        faultName: faultTypeObj
          ? faultTypeObj.title
          : 'Fault',
        parameters: { ...config }
      });

      setToastMessage(
        result?.success
          ? 'Fault injected successfully'
          : 'Fault injection failed'
      );
    } catch (error) {
      console.error(
        'Fault injection failed:',
        error
      );

      alert(
        `Fault injection failed: ${error.message}`
      );
    }
  };

  const isValid = validateConfig();
  const isConfigured = activeFault !== null;

  return (
    <section className="fault-injection">
      <div className="fi-header">
        <div>
          <h1 className="fi-header__title">
            Fault Injection
          </h1>

          <p className="fi-header__subtitle">
            Introduce controlled failures into your
            microservice architecture before simulation.
          </p>
        </div>

        <div className="fi-header__actions">
          <button
            className="btn btn--secondary"
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            className="btn btn--primary"
            onClick={handlePrepareInjection}
          >
            Prepare Injection
          </button>
        </div>
      </div>

      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#22c55e',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow:
              '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 9999,
            fontWeight: 500
          }}
        >
          {toastMessage}
        </div>
      )}

      <div className="fi-layout">
        <FaultTypePanel
          selectedFaultId={selectedFaultId}
          onSelectFault={handleSelectFault}
        />

        <InjectionPreview
          nodes={nodes}
          connections={connections}
          targetNodeId={selectedNodeId}
          activeFault={activeFault}
        />

        <FaultConfiguration
          nodes={nodes}
          faultTypes={FAULT_TYPES}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          selectedFaultId={selectedFaultId}
          configuration={configuration}
          onConfigChange={handleConfigChange}
          onInject={handleInjectFault}
          isConfigured={isConfigured}
          isValid={isValid}
        />
      </div>
    </section>
  );
}

export default FaultInjectionPage;

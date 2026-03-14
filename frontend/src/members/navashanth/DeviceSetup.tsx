import React, { useState } from 'react';
import { Wifi, Cpu, Battery, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';

const DeviceSetup: React.FC = () => {
  const [nodes, setNodes] = useState([
    { id: 'ND-01', location: 'Main Reservoir', status: 'Online', battery: 84, signal: 'Strong', active: true },
    { id: 'ND-02', location: 'Treatment Tank A', status: 'Online', battery: 62, signal: 'Medium', active: true },
    { id: 'ND-03', location: 'Outflow Pipe', status: 'Offline', battery: 0, signal: 'None', active: false },
  ]);

  const toggleNode = (index: number) => {
    const newNodes = [...nodes];
    newNodes[index].active = !newNodes[index].active;
    newNodes[index].status = newNodes[index].active ? 'Online' : 'Offline';
    setNodes(newNodes);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>IoT Device Configuration</h1>
        <p style={{ color: 'var(--text-muted)' }}>Hardware Diagnostics & ESP32 Sensor Grid Management</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
        {nodes.map((node, idx) => (
          <Card key={node.id} variant="white" padding="lg" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ 
                  background: node.active ? 'var(--safe-light)' : 'var(--bg-main)', 
                  padding: '16px', borderRadius: '12px', 
                  color: node.active ? 'var(--safe)' : 'var(--text-muted)' 
                }}>
                  <Cpu size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{node.id}</h3>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <MapPin size={14} /> {node.location}
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', 
                backgroundColor: node.active ? 'var(--safe-light)' : 'var(--danger-light)', 
                color: node.active ? 'var(--safe)' : 'var(--danger)',
                padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700
              }}>
                {node.active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {node.status}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Battery size={14} /> BATTERY
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: node.battery < 20 ? 'var(--danger)' : '#1e293b' }}>
                  {node.battery}%
                </span>
              </div>
              <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Wifi size={14} /> SIGNAL
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                  {node.signal}
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Last sync: {node.active ? 'Just now' : '2 hours ago'}
              </span>
              <Button 
                variant={node.active ? 'outline' : 'primary'} 
                size="sm"
                onClick={() => toggleNode(idx)}
              >
                {node.active ? 'Disconnect' : 'Attempt Reconnect'}
              </Button>
            </div>
          </Card>
        ))}
        
        <Card variant="white" padding="lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', cursor: 'pointer', minHeight: '300px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Cpu size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Provision New Node</h3>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Pair a new ESP32 sensor module to the network via Bluetooth.</p>
        </Card>
      </div>
    </div>
  );
};

export default DeviceSetup;

import React, { useState } from 'react';
import { ShieldCheck, Server, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';

const Alerts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('alerts');

  const alertData = [
    { name: 'pH Threshold Exceeded', value: 45, color: '#f15a24' },
    { name: 'TDS Warning', value: 25, color: '#f59e0b' },
    { name: 'Sensor Disconnect', value: 15, color: '#ef4444' },
    { name: 'Low Battery', value: 15, color: '#64748b' }
  ];

  const recentLogs = [
    { id: '1029', time: '10:45:12 AM', endpoint: '/api/v1/ingest', method: 'POST', status: 201 },
    { id: '1028', time: '10:44:09 AM', endpoint: '/api/v1/auth', method: 'POST', status: 200 },
    { id: '1027', time: '10:43:55 AM', endpoint: '/api/v1/alerts/34', method: 'PATCH', status: 200 },
    { id: '1026', time: '10:40:10 AM', endpoint: '/api/v1/ingest', method: 'POST', status: 401 }, // Auth failure mock
    { id: '1025', time: '10:35:12 AM', endpoint: '/api/v1/ingest', method: 'POST', status: 201 },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>Backend & Alerts Console</h1>
          <p style={{ color: 'var(--text-muted)' }}>System Infrastructure | Authentication & Real-time Ingestion</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant={activeTab === 'alerts' ? 'primary' : 'outline'} onClick={() => setActiveTab('alerts')}>Alert Distribution</Button>
          <Button variant={activeTab === 'api' ? 'primary' : 'outline'} onClick={() => setActiveTab('api')}>API Gateway</Button>
        </div>
      </header>
      
      {activeTab === 'alerts' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <Card padding="lg" variant="white">
            <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 700 }}>Alert Distribution (Last 7 Days)</h3>
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {alertData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card padding="lg" variant="white">
            <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 700 }}>Alert Action Queue</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3].map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertCircle color="var(--primary)" />
                    <div>
                      <p style={{ fontWeight: 600, color: '#1e293b' }}>pH Spike Detected - Node A1</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Triggered 10 minutes ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Acknowledge</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <Card padding="lg" variant="white">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={20} color="var(--primary)" /> Live API Traffic Log
            </h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--safe)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={16} /> JWT Auth Active
              </span>
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px', fontWeight: 500 }}>ID</th>
                <th style={{ padding: '12px', fontWeight: 500 }}>Time</th>
                <th style={{ padding: '12px', fontWeight: 500 }}>Method</th>
                <th style={{ padding: '12px', fontWeight: 500 }}>Endpoint</th>
                <th style={{ padding: '12px', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>#{log.id}</td>
                  <td style={{ padding: '16px 12px' }}>{log.time}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: log.method === 'POST' ? 'var(--blue-light)' : 'var(--bg-main)', color: log.method === 'POST' ? 'var(--blue)' : 'var(--text-muted)' }}>
                      {log.method}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', fontFamily: 'monospace' }}>{log.endpoint}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ color: log.status >= 400 ? 'var(--danger)' : 'var(--safe)', fontWeight: 600 }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default Alerts;

import React, { useMemo } from 'react';
import { 
  Droplet, 
  AlignJustify, 
  Thermometer, 
  Activity, 
  Download, 
  RefreshCw,
  BrainCircuit,
  AlertTriangle,
  TrendingUp,
  Wifi,
  ShieldCheck,
  CheckCircle,
  Info
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis, ScatterChart, Scatter, XAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, Legend, PieChart, Pie, Cell, ReferenceArea } from 'recharts';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { useSensorData } from '../../hooks/useSensorData';
import PHDetail from '../ajanth/PHDetail';
import TDSDetail from '../kabi/TDSDetail';
import TurbidityDetail from './TurbidityDetail';
import TempDetail from '../navashanth/TempDetail';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { current, history } = useSensorData();
  const [selectedSensor, setSelectedSensor] = React.useState<string | null>(null);

  // Generate mock ML prediction/anomaly data based on the history
  const mlData = useMemo(() => {
    return history.map((item, index) => {
      const isAnomaly = Math.random() > 0.85;
      const forecastVal = item.pH + (Math.random() * 0.4 - 0.2);
      
      return {
        ...item,
        anomalyScore: isAnomaly ? 80 + Math.random() * 20 : Math.random() * 30, // 0-100 score
        forecast: forecastVal,
        timestamp: index
      };
    });
  }, [history]);

  const getPercentage = (val: number, max: number) => Math.min(100, (val / max) * 100);

  const sensors = [
    { 
      id: 'ph',
      name: 'pH Level', 
      value: current.pH.value, 
      unit: 'pH', 
      status: current.pH.status, 
      icon: <Droplet />, 
      color: 'blue',
      max: 14,
      dataKey: 'pH'
    },
    { 
      id: 'tds',
      name: 'TDS (Solids)', 
      value: current.TDS.value, 
      unit: 'ppm', 
      status: current.TDS.status, 
      icon: <AlignJustify />, 
      color: 'orange',
      max: 600,
      dataKey: 'TDS'
    },
    { 
      id: 'turbidity',
      name: 'Turbidity', 
      value: current.Turbidity.value, 
      unit: 'NTU', 
      status: current.Turbidity.status, 
      icon: <Activity />, 
      color: 'yellow',
      max: 6,
      dataKey: 'Turbidity'
    },
    { 
      id: 'temp',
      name: 'Temperature', 
      value: current.Temperature.value, 
      unit: '°C', 
      status: current.Temperature.status, 
      icon: <Thermometer />, 
      color: 'red',
      max: 50,
      dataKey: 'Temperature'
    },
  ];

  const overallStatus = useMemo(() => {
    const statuses = [current.pH.status, current.TDS.status, current.Turbidity.status, current.Temperature.status];
    if (statuses.includes('Danger')) return 'Unsafe';
    if (statuses.includes('Warning')) return 'Moderate';
    return 'Safe';
  }, [current]);

  const probabilityData = useMemo(() => {
    if (overallStatus === 'Unsafe') return [{ name: 'Safe', value: 10 }, { name: 'Moderate', value: 25 }, { name: 'Unsafe', value: 65 }];
    if (overallStatus === 'Moderate') return [{ name: 'Safe', value: 30 }, { name: 'Moderate', value: 60 }, { name: 'Unsafe', value: 10 }];
    return [{ name: 'Safe', value: 87.5 }, { name: 'Moderate', value: 11.2 }, { name: 'Unsafe', value: 1.3 }];
  }, [overallStatus]);

  const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  // Calculate System-Wide Summary Metrics
  const systemMetrics = useMemo(() => {
    const temps = history.map(h => h.Temperature).filter(v => typeof v === 'number');
    const turbidities = history.map(h => h.Turbidity).filter(v => typeof v === 'number');
    const tdsValues = history.map(h => h.TDS).filter(v => typeof v === 'number');
    const phValues = history.map(h => h.pH).filter(v => typeof v === 'number');

    const avgTemp = temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : '0';
    const maxTurbidity = turbidities.length ? Math.max(...turbidities).toFixed(2) : '0';
    const avgTds = tdsValues.length ? (tdsValues.reduce((a, b) => a + b, 0) / tdsValues.length).toFixed(0) : '0';
    const avgPh = phValues.length ? (phValues.reduce((a, b) => a + b, 0) / phValues.length).toFixed(1) : '0';

    return { avgTemp, maxTurbidity, avgTds, avgPh };
  }, [history]);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <header className={styles.header}>
        <div className={styles.welcome}>
          <h1>Welcome to AquaMonitor</h1>
          <p>Your water quality is currently within <span className={styles.statusLink}>safe limits</span> for most parameters.</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" className={styles.refreshBtn}><RefreshCw size={18} /> Refresh Data</Button>
          <Button variant="outline"><Download size={18} /> Export PDF</Button>
        </div>
      </header>

      {/* System-Wide Metrics Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <Card variant="white" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>OVERALL QUALITY</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '8px 0 0 0', color: overallStatus === 'Safe' ? 'var(--safe)' : overallStatus === 'Moderate' ? 'var(--warning)' : 'var(--danger)' }}>
            {overallStatus}
          </h3>
        </Card>
        <Card variant="white" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>AVG pH</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '8px 0 0 0', color: '#1e293b' }}>{systemMetrics.avgPh} <span style={{fontSize:'0.875rem', fontWeight:600, color: 'var(--text-muted)'}}>pH</span></h3>
        </Card>
        <Card variant="white" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>AVG TEMP</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '8px 0 0 0', color: '#1e293b' }}>{systemMetrics.avgTemp} <span style={{fontSize:'0.875rem', fontWeight:600, color: 'var(--text-muted)'}}>°C</span></h3>
        </Card>
        <Card variant="white" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>MAX TURBIDITY</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '8px 0 0 0', color: '#1e293b' }}>{systemMetrics.maxTurbidity} <span style={{fontSize:'0.875rem', fontWeight:600, color: 'var(--text-muted)'}}>NTU</span></h3>
        </Card>
        <Card variant="white" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>AVG TDS</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '8px 0 0 0', color: '#1e293b' }}>{systemMetrics.avgTds} <span style={{fontSize:'0.875rem', fontWeight:600, color: 'var(--text-muted)'}}>ppm</span></h3>
        </Card>
      </div>

      {/* Sensor Grid Navigation */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Live Sensor Nodes</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>(Click a card for detailed analytics)</span>
      </div>
      <div className={styles.sensorGrid}>
        {sensors.map((sensor, idx) => (
          <Card 
            key={idx} 
            className={styles.sensorCard}
            onClick={() => setSelectedSensor(selectedSensor === sensor.id ? null : sensor.id)}
            style={{ 
              cursor: 'pointer', 
              transition: 'transform 0.2s',
              border: selectedSensor === sensor.id ? `2px solid var(--${sensor.color})` : '1px solid var(--border)' 
            }}
          >
            <div className={styles.sensorHeader}>
              <div className={`${styles.sensorIcon} ${styles[sensor.color]}`}>
                {sensor.icon}
              </div>
              <span className={`${styles.badge} ${styles[sensor.status.toLowerCase()]}`}>
                {sensor.status}
              </span>
            </div>
            <div className={styles.sensorBody}>
              <span className={styles.sensorLabel}>{sensor.name}</span>
              <div className={styles.sensorValueRow}>
                <span className={styles.sensorValue}>{sensor.value}</span>
                <span className={styles.sensorUnit}>{sensor.unit}</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                {sensor.id === 'ph' && (sensor.value > 6.5 && sensor.value < 8.5 ? "Ideal for drinking" : "Needs adjustment")}
                {sensor.id === 'tds' && (sensor.value < 300 ? "Highly pure water" : sensor.value < 600 ? "Good for consumption" : "Poor quality")}
                {sensor.id === 'turbidity' && (sensor.value < 1 ? "Crystal clear" : sensor.value < 5 ? "Acceptable clarity" : "Cloudy water")}
                {sensor.id === 'temp' && (sensor.value < 25 ? "Cool & refreshing" : "Warm water")}
              </p>
            </div>
            
            <div className={styles.sparklineContainer}>
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={history}>
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                  <Area 
                    type="monotone" 
                    dataKey={sensor.dataKey} 
                    stroke={`var(--${sensor.color})`} 
                    fill={`var(--${sensor.color}-light)`} 
                    strokeWidth={2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.sensorFooter}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ 
                    width: `${getPercentage(sensor.value, sensor.max)}%`, 
                    backgroundColor: `var(--${sensor.color})` 
                  }} 
                />
              </div>
              <div className={styles.rangeLabels}>
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Default Big Data View when no sensor is selected */}
      {!selectedSensor && (
        <div style={{ marginTop: '20px', borderTop: '2px dashed var(--border)', paddingTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <BrainCircuit size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>ML Analytics & Big Data Intelligence</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
            <Card variant="white" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '8px', fontSize: '1.25rem', fontWeight: 700 }}>ML Classification Probabilities</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                Real-time AI assessment probabilities based on aggregated sensor telemetry.
              </p>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={probabilityData} 
                      innerRadius={80} 
                      outerRadius={110} 
                      paddingAngle={5} 
                      dataKey="value"
                    >
                      {probabilityData.map((_entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />)}
                    </Pie>
                    <RechartsTooltip formatter={(value: any) => `${value}%`} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <Card variant="white" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--primary-light)', padding: '16px', borderRadius: '12px', color: 'var(--primary)' }}>
                  <BrainCircuit size={32} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>MODEL ACCURACY</p>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>94.2%</h2>
                </div>
              </div>
            </Card>
            <Card variant="white" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--warning-light)', padding: '16px', borderRadius: '12px', color: 'var(--warning)' }}>
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>DETECTED ANOMALIES</p>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>3</h2>
                </div>
              </div>
            </Card>
            <Card variant="white" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--blue-light)', padding: '16px', borderRadius: '12px', color: 'var(--blue)' }}>
                  <TrendingUp size={32} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>FORECAST HORIZON</p>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>12 hrs</h2>
                </div>
              </div>
            </Card>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Card variant="white" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px 0' }}>Warmth & Mineral Balance</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Showing how water heat affects mineral levels</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', maxWidth: '200px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', margin: 0 }}>
                    💡 <span style={{ color: 'var(--primary)' }}>Quick Tip:</span> Warmer water naturally absorbs more minerals.
                  </p>
                </div>
              </div>
              <div style={{ height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" dataKey="Temperature" name="Heat" domain={[15, 30]} tick={{ fill: '#64748b' }} label={{ value: 'Water Temperature (°C)', position: 'bottom', offset: 0, fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis type="number" dataKey="TDS" name="Minerals" domain={[100, 250]} tick={{ fill: '#64748b' }} label={{ value: 'Mineral Level', angle: -90, position: 'left', fontSize: 12, fill: '#94a3b8' }} />
                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => [value, name]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <ReferenceArea x1={15} x2={22} y1={100} y2={200} fill="#ecfdf5" fillOpacity={0.5} label={{ value: 'Healthy Range', position: 'insideTopLeft', fill: '#059669', fontSize: 10, fontWeight: 700 }} />
                    <Scatter name="Temp/TDS Correlation" data={mlData} fill="var(--primary)" opacity={0.6} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card variant="white" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 24px 0' }}>Contamination Flow Forecast</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mlData.slice(-10)} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                    <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                    <Legend />
                    <Bar dataKey="anomalyScore" name="Overflow Risk %" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Kabisek's Contribution: System Backend & Alerts */}
            <Card variant="white" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Activity size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>System Wellness & Alerts</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { title: "Everything is running smoothly", desc: "Sensors are checking water quality every 5 seconds", time: "Active Now", color: "#10b981", icon: <CheckCircle size={16} /> },
                  { title: "Mineral levels checked", desc: "Slightly higher than usual but still safe for home use", time: "2 mins ago", color: "#f59e0b", icon: <Info size={16} /> },
                  { title: "System check completed", desc: "Daily maintenance and data backup finished successfully", time: "1 hr ago", color: "#3b82f6", icon: <ShieldCheck size={16} /> }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    <div style={{ color: item.color, marginTop: '2px' }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.title}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" style={{ marginTop: '16px', width: '100%' }}>See Full History</Button>
            </Card>

            {/* Navashanthan's Contribution: IoT Infrastructure */}
            <Card variant="white" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Wifi size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Connection Status</h3>
              </div>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#64748b' }}>Network strength of your water sensors</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { name: "Main Water Tank", quality: "Excellent", signal: 95, color: "#10b981" },
                  { name: "Kitchen Outlet", quality: "Good", signal: 75, color: "#10b981" },
                  { name: "Garden Sensor", quality: "Weak", signal: 35, color: "#f59e0b" }
                ].map((signal, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                      <span>{signal.name}</span>
                      <span style={{ color: signal.color }}>{signal.quality}</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${signal.signal}%`, background: signal.color, borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '32px', padding: '16px', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', borderRadius: '16px', border: '1px solid #fde68a' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: 800, color: '#92400e' }}>💡 Home Tip</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400e', lineHeight: 1.5 }}>
                  The **Garden Sensor** signal is a bit low. Moving it closer to your door might make 
                  updates even faster!
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Inline Detail View for Specific Sensors */}
      {selectedSensor && (
        <div style={{ marginTop: '20px', borderTop: '2px dashed var(--border)', paddingTop: '40px' }}>
          {selectedSensor === 'ph' && <PHDetail onClose={() => setSelectedSensor(null)} />}
          {selectedSensor === 'tds' && <TDSDetail onClose={() => setSelectedSensor(null)} />}
          {selectedSensor === 'turbidity' && <TurbidityDetail onClose={() => setSelectedSensor(null)} />}
          {selectedSensor === 'temp' && <TempDetail onClose={() => setSelectedSensor(null)} />}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

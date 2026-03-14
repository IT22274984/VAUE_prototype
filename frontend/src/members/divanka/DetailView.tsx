import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { useSensorData } from '../../hooks/useSensorData';
import styles from './DetailView.module.css';

interface DetailViewProps {
  forceSensorId?: string;
}

const DetailView: React.FC<DetailViewProps> = ({ forceSensorId }) => {
  const navigate = useNavigate();
  // We extract the sensor ID from the URL (e.g., /analysis/ph) OR from the passed prop if rendered inline
  const { current, history, dailyHistory, weeklyHistory, monthlyHistory } = useSensorData();
  const [timeframe, setTimeframe] = useState<'Live' | 'Daily' | 'Weekly' | 'Monthly'>('Live');
  
  const pathParts = window.location.pathname.split('/');
  const urlSensorId = pathParts[pathParts.length - 1];
  const sensorId = forceSensorId || urlSensorId;

  const sensorConfig = useMemo(() => {
    switch(sensorId) {
      case 'ph': return { 
        key: 'pH', label: 'pH Level', min: 0, max: 14, optimalStr: '6.5-8.5', unit: 'pH',
        desc: 'Measures how acidic or basic the water is on a scale of 0 to 14.',
        impact: 'Extreme pH levels can accelerate pipe corrosion or reduce the effectiveness of disinfection, making water unsafe for consumption.',
        causes: 'Industrial runoff, chemical spills, or natural mineral deposits.'
      };
      case 'tds': return { 
        key: 'TDS', label: 'TDS (Solids)', min: 0, max: 600, optimalStr: '50-300', unit: 'ppm',
        desc: 'Total Dissolved Solids represents the complete concentration of dissolved substances in water.',
        impact: 'High TDS can lead to hard water scale, unpleasant taste, and potentially indicate the presence of harmful heavy metals or salts.',
        causes: 'Agricultural runoff, wastewater discharge, or geological erosion.'
      };
      case 'turbidity': return { 
        key: 'Turbidity', label: 'Turbidity', min: 0, max: 6, optimalStr: '0-1.5', unit: 'NTU',
        desc: 'A measure of water clarity. High turbidity means the water is cloudy or opaque.',
        impact: 'Suspended particles can shelter harmful microbes and pathogens from disinfection processes like chlorine or UV light.',
        causes: 'Soil erosion, heavy rainfall stirring up sediment, or excessive algae growth.'
      };
      case 'temp': return { 
        key: 'Temperature', label: 'Temperature', min: 0, max: 50, optimalStr: '10-30', unit: '°C',
        desc: 'Monitors the thermal state of the water. Essential baseline for other metrics.',
        impact: 'Warmer water holds less dissolved oxygen and significantly accelerates the growth of harmful bacteria and toxic algal blooms.',
        causes: 'Seasonal weather changes, shallow basin depths, or industrial thermal pollution.'
      };
      default: return { 
        key: 'pH', label: 'pH Level', min: 0, max: 14, optimalStr: '6.5-8.5', unit: 'pH',
        desc: 'Measures how acidic or basic the water is on a scale of 0 to 14.',
        impact: 'Extreme pH levels can accelerate pipe corrosion or reduce the effectiveness of disinfection, making water unsafe for consumption.',
        causes: 'Industrial runoff, chemical spills, or natural mineral deposits.'
      };
    }
  }, [sensorId]);

  // @ts-ignore - Dynamic key access
  const data = current[sensorConfig.key];
  const value = data.value;
  const status = data.status;

  // Calculate pointer rotation based on value mapped between min and max
  const percentage = Math.max(0, Math.min(100, ((value - sensorConfig.min) / (sensorConfig.max - sensorConfig.min)) * 100));
  const pointerRotation = -90 + (percentage * 1.8); // from -90 to +90 degrees (180 deg sweep)

  // Select which data array to render in Recharts based on `timeframe`
  const chartData = useMemo(() => {
    switch(timeframe) {
      case 'Daily': return dailyHistory;
      case 'Weekly': return weeklyHistory;
      case 'Monthly': return monthlyHistory;
      case 'Live':
      default: return history;
    }
  }, [timeframe, history, dailyHistory, weeklyHistory, monthlyHistory]);

  const summaryData = useMemo(() => {
    if (!chartData || chartData.length === 0) return { min: 0, max: 0, avg: 0, median: 0 };
    
    // Extract valid numbers
    const values = chartData.map(d => (d as any)[sensorConfig.key] as number).filter(v => typeof v === 'number' && !isNaN(v)).sort((a, b) => a - b);
    
    if (values.length === 0) return { min: 0, max: 0, avg: 0, median: 0 };
    
    const min = values[0];
    const max = values[values.length - 1];
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / values.length;
    
    let median = 0;
    const mid = Math.floor(values.length / 2);
    if (values.length % 2 === 0) {
      median = (values[mid - 1] + values[mid]) / 2;
    } else {
      median = values[mid];
    }
    
    return {
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
      avg: Number(avg.toFixed(2)),
      median: Number(median.toFixed(2))
    };
  }, [chartData, sensorConfig.key]);

  return (
    <div className={styles.container} style={forceSensorId ? { padding: 0 } : {}}>
      <header className={styles.header}>
        {!forceSensorId && (
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className={styles.backBtn}>
            <ArrowLeft size={20} /> Back to Dashboard
          </Button>
        )}
        <div className={styles.titleGroup}>
          <h1>{sensorConfig.label} Snapshot</h1>
          <p>Real-time {sensorConfig.label} monitoring and historical analysis.</p>
        </div>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <Card className={styles.gaugeCard}>
            <span className={styles.cardLabel}>CURRENT {sensorConfig.label.toUpperCase()}</span>
            <div className={styles.gaugeValue}>{value} <span style={{fontSize:'1.5rem', color:'#a0aec0'}}>{sensorConfig.unit}</span></div>
            <div className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}>Status: {status}</div>
            <div className={styles.gaugeVisual}>
              <div className={styles.gaugePointer} style={{ transform: `rotate(${pointerRotation}deg)` }} />
              <div className={styles.markerGroup}>
                <span className={styles.marker}>Low</span>
                <span className={styles.marker}>Optimal ({sensorConfig.optimalStr})</span>
                <span className={styles.marker}>High</span>
              </div>
            </div>
          </Card>

          <Card className={styles.chartCard} style={{ display: 'flex', flexDirection: 'column', height: 'auto', paddingBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>{sensorConfig.label} Trend Analysis</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Live', 'Daily', 'Weekly', 'Monthly'].map(tf => (
                  <Button 
                    key={tf}
                    variant={timeframe === tf ? 'primary' : 'outline'} 
                    size="sm" 
                    onClick={() => setTimeframe(tf as any)}
                  >
                    {tf}
                  </Button>
                ))}
              </div>
            </div>

            {/* Metric Summary Cards - Moved ABOVE the chart so they are highly visible */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{ padding: '16px', background: 'var(--background)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>MINIMUM</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0 0', color: '#1e293b' }}>{summaryData.min} <span style={{fontSize:'0.875rem', fontWeight:600, color: 'var(--text-muted)'}}>{sensorConfig.unit}</span></h3>
              </div>
              <div style={{ padding: '16px', background: 'var(--background)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>AVERAGE</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0 0', color: 'var(--primary)' }}>{summaryData.avg} <span style={{fontSize:'0.875rem', fontWeight:600, color: 'var(--text-muted)'}}>{sensorConfig.unit}</span></h3>
              </div>
              <div style={{ padding: '16px', background: 'var(--background)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>MEDIAN</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0 0', color: '#1e293b' }}>{summaryData.median} <span style={{fontSize:'0.875rem', fontWeight:600, color: 'var(--text-muted)'}}>{sensorConfig.unit}</span></h3>
              </div>
              <div style={{ padding: '16px', background: 'var(--background)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>MAXIMUM</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0 0', color: '#1e293b' }}>{summaryData.max} <span style={{fontSize:'0.875rem', fontWeight:600, color: 'var(--text-muted)'}}>{sensorConfig.unit}</span></h3>
              </div>
            </div>

            <div className={styles.chartPlaceholder} style={{ flex: 1, minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={sensorConfig.key} 
                    stroke="var(--primary)" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "var(--primary)", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 8, fill: "var(--primary)", stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className={styles.rightCol}>
          <Card variant="white" className={styles.infoCard}>
            <div className={styles.infoIcon}><Info size={24} /></div>
            <h2>Why {sensorConfig.label} matters?</h2>
            
            <p style={{ fontWeight: 600, marginBottom: '24px', fontSize: '1.125rem' }}>
              {sensorConfig.desc}
            </p>
            
            <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px' }}>
              <strong style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Safety Impact</strong>
              <p style={{ fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>{sensorConfig.impact}</p>
            </div>

            <div style={{ marginBottom: '32px', background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px' }}>
              <strong style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Common Causes of Spikes</strong>
              <p style={{ fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>{sensorConfig.causes}</p>
            </div>
            <div className={styles.updateStamp}>
              <strong>LATEST UPDATE</strong>
              <span>Just now from Main Reservoir</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailView;

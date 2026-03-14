import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Info, ChevronRight, TrendingUp, TrendingDown, Activity, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSensorData } from '../../hooks/useSensorData';
import styles from './TempDetail.module.css';

interface DetailProps {
  onClose?: () => void;
}

const TempDetail: React.FC<DetailProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { current, history, dailyHistory, weeklyHistory, monthlyHistory } = useSensorData();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/dashboard');
    }
  };
  const [timeframe, setTimeframe] = useState<'Live' | 'Daily' | 'Weekly' | 'Monthly'>('Live');

  const data = current.Temperature;
  const value = data.value;
  const status = data.status;

  const config = {
    min: 0,
    max: 50,
    lowerLimit: 15,
    idealRange: '20-30',
    upperLimit: 35,
    unit: '°C'
  };

  const percentage = Math.max(0, Math.min(100, ((value - config.min) / (config.max - config.min)) * 100));
  const pointerRotation = -90 + (percentage * 1.8);

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
    if (!chartData || chartData.length === 0) return { min: 0, max: 0, avg: 0 };
    const values = chartData.map(d => d.Temperature).filter(v => typeof v === 'number' && !isNaN(v));
    if (values.length === 0) return { min: 0, max: 0, avg: 0 };
    return {
      min: Math.min(...values).toFixed(1),
      max: Math.max(...values).toFixed(1),
      avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
    };
  }, [chartData]);

  return (
    <div className={styles.container}>
      <button className={styles.closeBtn} onClick={handleClose}>
        <X size={24} />
      </button>

      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>Temperature Monitoring</h1>
          <p>Real-time thermal analysis for Sensor Node: <span className={styles.sensorNode}>B-12 Primary Intake</span></p>
        </div>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.gaugeCard}>
          <div className={styles.statusBadge}>
            <CheckCircle size={18} /> {value >= 18 && value <= 24 ? 'Perfectly Refreshing' : 'Safe Levels'}
          </div>
          
          <div className={styles.gaugeContainer}>
            <div className={styles.gaugeValue}>
              <span className={styles.currentVal}>{value}°C</span>
              <span className={styles.updated}>Updated 2m ago</span>
            </div>
            
            <div className={styles.gaugeIllustration}>
              <div className={styles.gaugeRing} />
              <div className={styles.gaugePointer} style={{ transform: `rotate(${pointerRotation}deg)` }} />
            </div>

            <div className={styles.limits}>
              <div className={styles.limitBox}>
                <span className={styles.limitLabel}>Lower Limit</span>
                <span className={styles.limitVal}>{config.lowerLimit}°C</span>
              </div>
              <div className={styles.limitBox}>
                <span className={styles.limitLabel}>Ideal Range</span>
                <span className={`${styles.limitVal} ${styles.ideal}`}>{config.idealRange}°C</span>
              </div>
              <div className={styles.limitBox}>
                <span className={styles.limitLabel}>Upper Limit</span>
                <span className={styles.limitVal}>{config.upperLimit}°C</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoIcon}><Info size={28} /></div>
          <h2>Why Temperature Matters?</h2>
          <p>
            Water temperature influences the chemical and biological processes in aquatic systems. 
            It affects oxygen solubility, metabolic rates of aquatic organisms, and the toxicity of 
            certain pollutants. Monitoring ensures optimal ecosystem health and prevents hazardous bacterial blooms.
          </p>
          <div className={styles.learnMore}>
            Learn more about thresholds <ChevronRight size={18} />
          </div>
        </div>
      </div>

      <div className={styles.trendCard}>
        <div className={styles.trendHeader}>
          <h3>Temperature Trends ({timeframe === 'Live' ? 'Last 24 Hours' : timeframe})</h3>
          <div className={styles.timeFilters}>
            {['Live', 'Daily', 'Weekly', 'Monthly'].map(tf => (
              <button 
                key={tf} 
                className={`${styles.filterBtn} ${timeframe === tf ? styles.active : ''}`}
                onClick={() => setTimeframe(tf as any)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.summaryRow}>
          <div className={styles.summaryItem}>
            <Activity className={styles.summaryIcon} size={24} color="#f67c2e" />
            <span className={styles.summaryLabel}>Average Temp</span>
            <div className={styles.summaryVal}>{summaryData.avg}°C</div>
            <div style={{color:'#10b981', fontSize:'0.8rem', fontWeight:600, marginTop:4}}>Within safe range</div>
          </div>
          <div className={styles.summaryItem}>
            <TrendingDown className={styles.summaryIcon} size={24} color="#3b82f6" />
            <span className={styles.summaryLabel}>Min Temp</span>
            <div className={styles.summaryVal}>{summaryData.min}°C</div>
            <div style={{color:'#a0aec0', fontSize:'0.8rem', marginTop:4}}>at 03:15 AM today</div>
          </div>
          <div className={styles.summaryItem}>
            <TrendingUp className={styles.summaryIcon} size={24} color="#ef4444" />
            <span className={styles.summaryLabel}>Max Temp</span>
            <div className={styles.summaryVal}>{summaryData.max}°C</div>
            <div style={{color:'#a0aec0', fontSize:'0.8rem', marginTop:4}}>at 02:45 PM today</div>
          </div>
        </div>

        <div style={{ height: 420, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="Temperature" 
                stroke="#f67c2e" 
                strokeWidth={4}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#991b1b', fontSize: '0.85rem' }}>Domestic Use</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#b91c1c' }}>Perfect for bathing and cleaning at the current {value}°C.</p>
          </div>
          <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #dbeafe' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#1e40af', fontSize: '0.85rem' }}>Drinking Tip</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#1d4ed8' }}>Best served chilled below 15°C for maximum refreshment.</p>
          </div>
        </div>
      </div>

      <div className={styles.alertsCard} style={{ marginTop: '32px' }}>
        <div className={styles.alertsHeader}>
          <h3 style={{ margin: 0 }}>Recent Thermal Alerts</h3>
          <span className={styles.viewAll}>View All History</span>
        </div>
        <table className={styles.alertsTable}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Reading</th>
              <th>Status</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Oct 24, 02:48 PM</td>
              <td>31.2°C</td>
              <td><span className={`${styles.statusTag} ${styles.warning}`}>WARNING</span></td>
              <td>Node B-12</td>
            </tr>
            <tr>
              <td>Oct 23, 11:20 PM</td>
              <td>14.5°C</td>
              <td><span className={`${styles.statusTag} ${styles.unsafe}`}>UNSAFE</span></td>
              <td>Node B-12</td>
            </tr>
            <tr>
              <td>Oct 22, 09:05 AM</td>
              <td>35.8°C</td>
              <td><span className={`${styles.statusTag} ${styles.unsafe}`}>UNSAFE</span></td>
              <td>Node B-12</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TempDetail;

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Info, ArrowRight, Eye, BarChart2, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSensorData } from '../../hooks/useSensorData';
import styles from './TDSDetail.module.css';

interface DetailProps {
  onClose?: () => void;
}

const TDSDetail: React.FC<DetailProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { current, history, dailyHistory, weeklyHistory, monthlyHistory } = useSensorData();
  const [timeframe, setTimeframe] = useState<'Live' | 'Daily' | 'Weekly' | 'Monthly'>('Live');

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/dashboard');
    }
  };

  const chartData = useMemo(() => {
    switch(timeframe) {
      case 'Daily': return dailyHistory;
      case 'Weekly': return weeklyHistory;
      case 'Monthly': return monthlyHistory;
      case 'Live':
      default: return history;
    }
  }, [timeframe, history, dailyHistory, weeklyHistory, monthlyHistory]);

  const data = current.TDS;
  const value = data.value;
  const status = data.status;

  const config = {
    min: 0,
    max: 600,
    lowerLimit: 0,
    optimalRange: '50-300',
    warningLimit: 500,
    unit: 'ppm'
  };

  return (
    <div className={styles.container}>
      <button className={styles.closeBtn} onClick={handleClose}>
        <X size={20} />
      </button>

      <header className={styles.header}>
        <h1>TDS Monitoring</h1>
        <p>Smart Water Quality Management System</p>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.gaugeCard}>
          <div className={styles.statusBadge}>
            <div style={{width:8, height:8, borderRadius:'50%', background:'#10b981'}} /> 
            {value < 300 ? 'Crystal Pure' : 'Safe to Drink'}
          </div>

          <div className={styles.gaugeRingContainer}>
            <div className={styles.gaugeRing} />
            <div className={styles.gaugeProgress} style={{ transform: `rotate(${(value/config.max)*180}deg)` }} />
            <div className={styles.gaugeContent}>
              <span className={styles.currentValue}>{value}</span>
              <span className={styles.unit}>{config.unit}</span>
            </div>
          </div>

          {/* New User Friendly Drinkability Scale */}
          <div style={{ width: '100%', marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>DRINKABILITY SCALE</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f97316' }}>GOOD QUALITY</span>
            </div>
            <div style={{ height: 12, width: '100%', background: '#f1f5f9', borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '30%', height: '100%', background: '#10b981', opacity: value < 150 ? 1 : 0.3 }} />
              <div style={{ width: '30%', height: '100%', background: '#34d399', opacity: value >= 150 && value < 300 ? 1 : 0.3 }} />
              <div style={{ width: '20%', height: '100%', background: '#fbbf24', opacity: value >= 300 && value < 500 ? 1 : 0.3 }} />
              <div style={{ width: '20%', height: '100%', background: '#f87171', opacity: value >= 500 ? 1 : 0.3 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>
              <span>EXCELLENT</span>
              <span>GOOD</span>
              <span>FAIR</span>
              <span>POOR</span>
            </div>
          </div>

          <div className={styles.gaugeLimits} style={{ marginTop: 32 }}>
            <div className={styles.limitRow}>
              <span className={styles.limitLabel}>Lower Limit</span>
              <span className={styles.limitValue}>{config.lowerLimit} {config.unit}</span>
            </div>
            <div className={styles.limitRow}>
              <span className={styles.limitLabel}>Recommended Range</span>
              <span className={`${styles.limitValue} ${styles.optimal}`}>50 - 300 ppm</span>
            </div>
            <div className={styles.limitRow}>
              <span className={styles.limitLabel}>Health Warning Boundary</span>
              <span className={styles.limitValue}>{config.warningLimit} {config.unit}</span>
            </div>
          </div>
        </div>

        <div className={styles.sideInfo}>
          <div className={styles.infoCard}>
            <h2><Info size={28} /> What is TDS?</h2>
            <p>
              Total Dissolved Solids measures the concentration of minerals, salts, and metals in your water.
              Levels below 300 ppm indicate excellent purity.
            </p>
            <button className={styles.miniGuideBtn}>
              Quality Guide <ArrowRight size={16} />
            </button>
          </div>
          
          <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <BarChart2 size={20} color="#f97316" />
              <div>
                <span className={styles.statLabel}>Avg (24H)</span>
                <div className={styles.statVal}>338 ppm</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <TrendingDown size={20} color="#10b981" />
              <div>
                <span className={styles.statLabel}>Min Level</span>
                <div className={styles.statVal}>312 ppm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.trendSection}>
        <div className={styles.trendCard}>
          <div className={styles.trendHeader}>
            <div className={styles.trendTitles}>
              <h3>TDS Trend Analysis</h3>
              <p>Historical data for better maintenance planning</p>
            </div>
            <div className={styles.tfToggles}>
              {['Live', 'Daily', 'Weekly', 'Monthly'].map(tf => (
                <button 
                  key={tf}
                  onClick={() => setTimeframe(tf as any)}
                  className={`${styles.tfBtn} ${timeframe === tf ? styles.active : ''}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.chartContainer}>
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
                  dataKey="TDS" 
                  stroke="#f97316" 
                  strokeWidth={4}
                  dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.humanInsight}>
            <div className={styles.insightIcon}><Info size={18} /></div>
            <p>
              <strong>Pro Insight:</strong> TDS levels are currently stable. Values between 300-600 ppm 
              are typical for high-quality tap water and perfectly safe for domestic use.
            </p>
          </div>
        </div>

        <div className={styles.alertsCard}>
          <div className={styles.alertsHeader}>
            <h3>Recent Alerts</h3>
            <span className={styles.reportLink}>Report</span>
          </div>
          <div className={styles.alertsList}>
            {[
              { time: '12:45 PM', status: 'normal', val: '342 ppm' },
              { time: '11:30 AM', status: 'normal', val: '339 ppm' },
              { time: '10:15 AM', status: 'warning', val: '512 ppm' },
              { time: '09:00 AM', status: 'normal', val: '325 ppm' },
              { time: '07:45 AM', status: 'unsafe', val: '721 ppm' },
            ].map((alert, i) => (
              <div key={i} className={styles.alertRow}>
                <div className={styles.alertTime}>{alert.time}</div>
                <div className={`${styles.statusDot} ${styles[alert.status]}`} />
                <div className={styles.alertVal}>{alert.val}</div>
                <Eye size={14} className={styles.rowBtn} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TDSDetail;

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Info, LayoutGrid, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSensorData } from '../../hooks/useSensorData';
import styles from './TurbidityDetail.module.css';

interface DetailProps {
  onClose?: () => void;
}

const TurbidityDetail: React.FC<DetailProps> = ({ onClose }) => {
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

  const data = current.Turbidity;
  const value = data.value;
  const status = data.status;

  const chartData = useMemo(() => {
    switch(timeframe) {
      case 'Daily': return dailyHistory;
      case 'Weekly': return weeklyHistory;
      case 'Monthly': return monthlyHistory;
      case 'Live':
      default: return history;
    }
  }, [timeframe, history, dailyHistory, weeklyHistory, monthlyHistory]);

  return (
    <div className={styles.container}>
      <header className={styles.navHeader}>
        <button className={styles.closeBtn} onClick={handleClose}>
           <X size={18} /> Close
        </button>
      </header>

      <div className={styles.mainHeader}>
        <h1>Turbidity Monitoring</h1>
        <p>Real-time water cloudiness tracking and analysis</p>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.readingCard}>
          <span className={styles.cardTitle}>Current Reading</span>
          <div className={styles.gaugeWrapper}>
            <div className={styles.gaugeCircle}>
              <span className={styles.gaugeValue}>{value}</span>
              <span className={styles.gaugeUnit}>NTU</span>
            </div>
          </div>
          <span className={styles.statusTag}>
            {value <= 1 ? 'Crystal Clear' : value <= 5 ? 'Perfectly Safe' : 'Slightly Cloudy'}
          </span>
          <div className={styles.legend}>
            <div className={styles.legendItem}><div className={styles.dot} style={{background:'#10b981'}} /> &lt;5 Safe</div>
            <div className={styles.legendItem}><div className={styles.dot} style={{background:'#f97316'}} /> 5-10 Caution</div>
            <div className={styles.legendItem}><div className={styles.dot} style={{background:'#ef4444'}} /> &gt;10 Warning</div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3><Info className={styles.infoIcon} size={24} /> What is Turbidity?</h3>
          <p>
            Turbidity is the measure of relative clarity of a liquid. It is an optical characteristic 
            of water and is an expression of the amount of light that is scattered by material in the 
            water when a light is shined through the water sample.
          </p>
          <div className={styles.limitBox}>
            <div className={styles.limitHeader}>
              <LayoutGrid size={16} /> Standard Limit
            </div>
            <div className={styles.limitBody}>
              The standard safe limit for drinking water is 5 NTU. Regular monitoring ensures 
              filtration systems are performing optimally.
            </div>
          </div>
        </div>

        <div className={styles.summaryCol}>
          <div className={styles.summaryMiniCard}>
            <div>
              <span className={styles.miniLabel}>Average (24H)</span>
              <div className={styles.miniValue}>2.8 <span style={{fontSize:'0.9rem', color:'#94a3b8'}}>NTU</span></div>
            </div>
            <div className={styles.miniIcon} style={{background:'#eff6ff', color:'#3b82f6'}}>
              <BarChart3 size={20} />
            </div>
            <div style={{position:'absolute', right:40, top:45, color:'#10b981', fontSize:'0.7rem', fontWeight:800}}>+1.2%</div>
          </div>
          <div className={styles.summaryMiniCard}>
            <div>
              <span className={styles.miniLabel}>Minimum</span>
              <div className={styles.miniValue}>1.5 <span style={{fontSize:'0.9rem', color:'#94a3b8'}}>NTU</span></div>
            </div>
            <div className={styles.miniIcon} style={{background:'#ecfdf5', color:'#10b981'}}>
              <TrendingDown size={20} />
            </div>
          </div>
          <div className={styles.summaryMiniCard}>
            <div>
              <span className={styles.miniLabel}>Maximum</span>
              <div className={styles.miniValue}>6.2 <span style={{fontSize:'0.9rem', color:'#94a3b8'}}>NTU</span></div>
            </div>
            <div className={styles.miniIcon} style={{background:'#fff7ed', color:'#f97316'}}>
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.trendCard}>
        <div className={styles.trendHeader}>
          <h3>Turbidity Trend Analysis</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Live', 'Daily', 'Weekly', 'Monthly'].map(tf => (
              <button 
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1px solid #f1f5f9',
                  background: timeframe === tf ? '#10b981' : 'white',
                  color: timeframe === tf ? 'white' : '#64748b',
                  cursor: 'pointer'
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <p style={{marginTop:-24, color:'#94a3b8', fontSize:'0.85rem', marginBottom:32}}>
          {timeframe === 'Live' ? 'Hourly variations over the last 24 hours' : `${timeframe} historical analysis`}
        </p>
        <div style={{ height: 400, width: '100%' }}>
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
                dataKey="Turbidity" 
                stroke="#10b981" 
                strokeWidth={4}
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
          <div style={{ background: '#10b981', color: 'white', padding: '8px', borderRadius: '50%' }}>
            <Info size={16} />
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534' }}>
            <strong>Human Insight:</strong> High turbidity makes water look "cloudy". 
            If the chart spikes above 5 NTU, the water may look hazy to the naked eye.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TurbidityDetail;

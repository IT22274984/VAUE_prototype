import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Droplets, Info, TrendingUp, ChevronRight } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { useSensorData } from '../../hooks/useSensorData';
import styles from './PHDetail.module.css';

interface DetailProps {
  onClose?: () => void;
}

const PHDetail: React.FC<DetailProps> = ({ onClose }) => {
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

  const data = current.pH;
  const value = data.value;

  const pointerLeft = (value / 14) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.header}>
          <h1>pH Level Snapshot</h1>
          <p>Real-time acidity & alkalinity analysis</p>
        </div>
        <button className={styles.closeBtn} onClick={handleClose}>
          <X size={24} color="#1e293b" />
        </button>
      </div>

      <div className={styles.mainLayout}>
        <div className={styles.phScaleCard}>
          <div className={styles.currentPh}>
            <span className={styles.phVal}>{value}</span>
            <div className={styles.phStatusContainer}>
              <span className={styles.phStatus}>
                {value >= 6.5 && value <= 8.5 ? 'Perfectly Balanced' : value < 6.5 ? 'Slightly Acidic' : 'Slightly Alkaline'}
              </span>
            </div>
          </div>

          <div className={styles.scaleVisual}>
            <div className={styles.scalePointer} style={{ left: `${pointerLeft}%` }} />
          </div>

          <div className={styles.scaleLabels}>
            <div className={styles.scaleLabel}><span className={styles.labelNum}>0</span><span className={styles.labelName}>Acidic</span></div>
            <div className={styles.scaleLabel} style={{marginLeft:'-20px'}}><span className={styles.labelNum}>7</span><span className={styles.labelName}>Neutral</span></div>
            <div className={styles.scaleLabel}><span className={styles.labelNum}>14</span><span className={styles.labelName}>Alkaline</span></div>
          </div>

          <div style={{marginTop:40, display:'flex', gap:20}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'0.7rem', color:'#94a3b8', fontWeight:700}}>OPTIMAL</div>
              <div style={{fontSize:'1.1rem', fontWeight:800, color:'#22c55e'}}>6.5 - 8.5</div>
            </div>
            <div style={{width:1, height:40, background:'#e2e8f0'}} />
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'0.7rem', color:'#94a3b8', fontWeight:700}}>LATEST UPDATE</div>
              <div style={{fontSize:'1.1rem', fontWeight:800, color:'#1e293b'}}>Just Now</div>
            </div>
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.infoBlock}>
            <h2><Info size={24} style={{verticalAlign:'middle', marginRight:8}} /> Why pH Matters?</h2>
            <p>
              The pH level measures how acidic or basic the water is on a scale of 0 to 14. 
              Extreme pH levels can accelerate pipe corrosion or reduce the effectiveness of 
              disinfection, making water unsafe for consumption.
              <br /><br />
              Sudden changes often indicate industrial runoff or chemical spills.
            </p>
            <div style={{display:'flex', alignItems:'center', gap:4, marginTop:16, color:'#3b82f6', fontWeight:700, cursor:'pointer'}}>
              View Safety Guidelines <ChevronRight size={16} />
            </div>
          </div>

          <div className={styles.trendMini}>
            <div className={styles.miniHeader}>
              <h3>pH Trend</h3>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Live', 'Daily', 'Weekly', 'Monthly'].map(tf => (
                  <button 
                    key={tf}
                    onClick={() => setTimeframe(tf as any)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      border: '1px solid #e2e8f0',
                      background: timeframe === tf ? '#8b5cf6' : 'white',
                      color: timeframe === tf ? 'white' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ height: 380, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pH" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorPh)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:16}}>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <TrendingUp size={16} color="#16a34a" />
                <span style={{fontSize:'0.8rem', fontWeight:700, color:'#475569'}}>Avg: 7.2 pH</span>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <Droplets size={16} color="#3b82f6" />
                <span style={{fontSize:'0.8rem', fontWeight:700, color:'#475569'}}>Stable</span>
              </div>
            </div>
          </div>

          <div className={styles.infoBlock} style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', border: '1px solid #ddd6fe', marginTop: '24px' }}>
            <h3 style={{ color: '#5b21b6', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
              <Info size={20} /> Safety Guide for Families
            </h3>
            <p style={{ color: '#6d28d9', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
              <strong>Safe to Drink?</strong> Yes, if the level is between 6.5 and 8.5. 
              Levels outside this range might taste bitter (high pH) or metallic (low pH) and can damage pipes over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PHDetail;

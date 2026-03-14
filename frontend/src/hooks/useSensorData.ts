import { useState, useEffect, useMemo } from 'react';

export interface SensorReading {
  time: string;
  pH: number;
  TDS: number;
  Turbidity: number;
  Temperature: number;
}

export interface CurrentMetrics {
  pH: { value: number; status: 'Safe' | 'Warning' | 'Danger' };
  TDS: { value: number; status: 'Safe' | 'Warning' | 'Danger' };
  Turbidity: { value: number; status: 'Safe' | 'Warning' | 'Danger' };
  Temperature: { value: number; status: 'Safe' | 'Warning' | 'Danger' };
}

export const useSensorData = () => {
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [current, setCurrent] = useState<CurrentMetrics>({
    pH: { value: 7.2, status: 'Safe' },
    TDS: { value: 150, status: 'Safe' },
    Turbidity: { value: 0.5, status: 'Safe' },
    Temperature: { value: 22.0, status: 'Safe' },
  });

  // Initialize with some historical mock data
  useEffect(() => {
    const initialHistory: SensorReading[] = [];
    const now = new Date();
    for (let i = 20; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
      initialHistory.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pH: +(7.0 + Math.random() * 0.4 - 0.2).toFixed(2),
        TDS: +(140 + Math.random() * 20 - 10).toFixed(0),
        Turbidity: +(0.4 + Math.random() * 0.2).toFixed(2),
        Temperature: +(22.0 + Math.random() * 0.5).toFixed(1),
      });
    }
    setHistory(initialHistory);
  }, []);

  // Simulate incoming MQTT live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      // Generate slightly jittery new data
      const newPh = +(curr => curr.pH.value + (Math.random() * 0.1 - 0.05))(current).toFixed(2);
      const newTDS = +(curr => curr.TDS.value + (Math.random() * 5 - 2.5))(current).toFixed(0);
      const newTurb = +(curr => Math.max(0.1, curr.Turbidity.value + (Math.random() * 0.1 - 0.05)))(current).toFixed(2);
      const newTemp = +(curr => curr.Temperature.value + (Math.random() * 0.2 - 0.1))(current).toFixed(1);

      const newReading: SensorReading = {
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        pH: newPh,
        TDS: newTDS,
        Turbidity: newTurb,
        Temperature: newTemp,
      };

      // Rules based on provided requirements
      const getStatus = (val: number, min: number, max: number, strictMax: number): 'Safe' | 'Warning' | 'Danger' => {
        if (val < min || val > strictMax) return 'Danger';
        if (val > max) return 'Warning';
        return 'Safe';
      };

      setCurrent({
        pH: { value: newPh, status: getStatus(newPh, 6.5, 8.0, 8.5) },
        TDS: { value: newTDS, status: getStatus(newTDS, 50, 300, 500) },
        Turbidity: { value: newTurb, status: getStatus(newTurb, 0, 1.5, 5.0) },
        Temperature: { value: newTemp, status: getStatus(newTemp, 10, 30, 40) },
      });

      setHistory(prev => [...prev.slice(1), newReading]);
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [current]);

  // Generate historical data spanning larger timeframes
  const dailyHistory = useMemo(() => {
    const data: SensorReading[] = [];
    const now = new Date();
    // 24 hours, data point every hour
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000);
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pH: +(7.0 + Math.random() * 0.8 - 0.4).toFixed(2),
        TDS: +(140 + Math.random() * 40 - 20).toFixed(0),
        Turbidity: +(0.4 + Math.random() * 0.6).toFixed(2),
        Temperature: +(22.0 + Math.random() * 2.0).toFixed(1),
      });
    }
    return data;
  }, []);

  const weeklyHistory = useMemo(() => {
    const data: SensorReading[] = [];
    const now = new Date();
    // 7 days, data point every day
    for (let i = 6; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 86400000);
      data.push({
        time: time.toLocaleDateString([], { weekday: 'short' }),
        pH: +(7.0 + Math.random() * 1.0 - 0.5).toFixed(2),
        TDS: +(140 + Math.random() * 50 - 25).toFixed(0),
        Turbidity: +(0.4 + Math.random() * 0.8).toFixed(2),
        Temperature: +(22.0 + Math.random() * 3.0).toFixed(1),
      });
    }
    return data;
  }, []);

  const monthlyHistory = useMemo(() => {
    const data: SensorReading[] = [];
    const now = new Date();
    // ~30 days, data point every two days for cleaner chart
    for (let i = 30; i >= 0; i -= 2) {
      const time = new Date(now.getTime() - i * 86400000);
      data.push({
        time: time.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        pH: +(7.0 + Math.random() * 1.2 - 0.6).toFixed(2),
        TDS: +(140 + Math.random() * 60 - 30).toFixed(0),
        Turbidity: +(0.4 + Math.random() * 1.0).toFixed(2),
        Temperature: +(22.0 + Math.random() * 4.0).toFixed(1),
      });
    }
    return data;
  }, []);

  return { current, history, dailyHistory, weeklyHistory, monthlyHistory };
};

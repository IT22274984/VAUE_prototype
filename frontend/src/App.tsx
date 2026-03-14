import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './members/divanka/LoginPage';
import Dashboard from './members/divanka/Dashboard';
import PHDetail from './members/ajanth/PHDetail';
import TDSDetail from './members/kabi/TDSDetail';
import TurbidityDetail from './members/divanka/TurbidityDetail';
import TempDetail from './members/navashanth/TempDetail';
import Alerts from './members/kabi/Alerts';
import DeviceSetup from './members/navashanth/DeviceSetup';
import Layout from './components/shared/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Core application logic wrapped in persistent Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis/ph" element={<PHDetail />} />
          <Route path="/analysis/tds" element={<TDSDetail />} />
          <Route path="/analysis/turbidity" element={<TurbidityDetail />} />
          <Route path="/analysis/temp" element={<TempDetail />} />
          <Route path="/backend-alerts" element={<Alerts />} />
          <Route path="/iot-setup" element={<DeviceSetup />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

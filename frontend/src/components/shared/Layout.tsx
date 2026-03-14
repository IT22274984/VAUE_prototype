import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Droplet, Bell, Settings, LogOut } from 'lucide-react';
import { Button } from './Button';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className={styles.layoutContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logo} onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>
          <div className={styles.logoIcon}><Droplet size={20} color="white" /></div>
          <span className={styles.logoText}>AquaMonitor</span>
        </div>
        <div className={styles.navLinks}>
          <a onClick={() => navigate('/dashboard')} className={isActive('/dashboard') ? styles.active : ''} style={{cursor: 'pointer'}}>Dashboard</a>
          <a onClick={() => navigate('/backend-alerts')} className={isActive('/backend-alerts') ? styles.active : ''} style={{cursor: 'pointer'}}>Backend Alerts</a>
          <a onClick={() => navigate('/iot-setup')} className={isActive('/iot-setup') ? styles.active : ''} style={{cursor: 'pointer'}}>IoT Setup</a>
        </div>
        <div className={styles.navActions}>
          <button className={styles.iconBtn} onClick={() => navigate('/backend-alerts')}><Bell size={20} /></button>
          <button className={styles.iconBtn} onClick={() => navigate('/iot-setup')}><Settings size={20} /></button>
          <div className={styles.profile}>
            <div className={styles.profileInfo}>
              <span className={styles.userName}>Administrator</span>
              <span className={styles.userRole}>System Control</span>
            </div>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="avatar" className={styles.avatar} />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/login')}
            style={{ marginLeft: '12px', color: 'var(--danger)' }}
          >
            <LogOut size={18} style={{ marginRight: '6px' }} />
            Logout
          </Button>
        </div>
      </nav>
      
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

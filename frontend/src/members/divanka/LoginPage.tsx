import React, { useState } from 'react';
import { Mail, Lock, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { Input } from '../../components/shared/Input';
import styles from './Login.module.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.waveBg} />
      
      <Card className={styles.loginCard} padding="none">
        <div className={styles.header}>
          <div className={styles.logoCircle}>
            <Droplets color="white" size={32} />
          </div>
        </div>
        
        <div className={styles.content}>
          <h1 className={styles.title}>AquaFlow</h1>
          <p className={styles.subtitle}>Secure login to your water quality dashboard</p>
          
          <form className={styles.form} onClick={handleLogin}>
            <Input 
              label="Email or Username"
              placeholder="e.g. analyst@aquaflow.com"
              icon={<Mail size={18} />}
            />
            
            <Input 
              label="Password"
              type="password"
              placeholder="Enter your secret password"
              icon={<Lock size={18} />}
            />
            
            <div className={styles.actions}>
              <label className={styles.remember}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className={styles.forgot}>Forgot Password?</a>
            </div>
            
            <Button fullWidth size="lg" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Login to Dashboard'}
            </Button>
          </form>
          
          <p className={styles.footer}>
            Need access? <a href="#">Contact Administrator</a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;

import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  icon, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrapper} ${error ? styles.errorBorder : ''}`}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input className={styles.input} {...props} />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

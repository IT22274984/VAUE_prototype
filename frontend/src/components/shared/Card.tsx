import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'white',
  padding = 'md',
  ...rest
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[`p-${padding}`],
    className
  ].join(' ');

  return <div className={cardClasses} {...rest}>{children}</div>;
};

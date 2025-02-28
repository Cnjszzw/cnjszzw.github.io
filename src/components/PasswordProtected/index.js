import React, { useState, useEffect } from 'react';
import { setAuthenticated } from '@site/src/utils/auth';
import styles from './styles.module.css';

export default function PasswordProtected({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // 添加全局键盘事件监听
    const handleKeyPress = (e) => {
      if (e.key.match(/^[a-zA-Z]$/) && password.length < 4) {
        setPassword(prev => (prev + e.key).toUpperCase());
        setError(false);
      } else if (e.key === 'Backspace') {
        setPassword(prev => prev.slice(0, -1));
        setError(false);
      } else if (e.key === 'Enter' && password.length === 4) {
        handleSubmit(e);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = setAuthenticated(password);
    if (!isValid) {
      setError(true);
      setPassword('');
    } else {
      onSuccess?.();
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <div className={styles.textLine}>I AM</div>
        <form onSubmit={handleSubmit} className={styles.passwordLine}>
          {Array(4).fill().map((_, i) => (
            <div key={i} className={styles.charBox}>
              {password[i] || ''}
            </div>
          ))}
        </form>
        <div className={styles.textLine}>LOCKED</div>
        {error && <div className={styles.error}>密码错误</div>}
      </div>
    </div>
  );
} 
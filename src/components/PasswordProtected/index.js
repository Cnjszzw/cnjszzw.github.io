import React, { useState, useEffect } from 'react';
import { setAuthenticated } from '@site/src/utils/auth';
import styles from './styles.module.css';
import clsx from 'clsx';

export default function PasswordProtected({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // 检查初始认证状态
    const checkInitialAuth = () => {
      const isValid = setAuthenticated('');  // 空字符串只会检查状态而不会设置新密码
      if (isValid) {
        onSuccess?.();
      }
      setIsInitialCheck(false);
    };
    checkInitialAuth();
  }, []);

  useEffect(() => {
    if (!isClient) return;  // 只在客户端添加事件监听

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
  }, [password, isClient]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const isValid = setAuthenticated(password);
    if (!isValid) {
      setError(true);
      setPassword('');
    } else {
      onSuccess?.();
    }
  };

  // 在初始检查完成之前不渲染任何内容
  if (isInitialCheck) {
    return null;
  }

  // 只在客户端渲染
  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <div className={styles.textLine}>I AM</div>
        <form onSubmit={handleSubmit} className={styles.passwordLine}>
          {Array(4).fill().map((_, i) => (
            <div
              key={i}
              className={clsx(
                styles.charBox,
                i === password.length && password.length < 4 && styles.active
              )}
            >
              {password[i] || ''}
            </div>
          ))}
        </form>
        <div className={clsx(styles.textLine, error && styles.error)}>LOCKED</div>
      </div>
    </div>
  );
} 
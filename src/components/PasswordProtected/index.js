import React, { useState } from 'react';
import { setAuthenticated } from '@site/src/utils/auth';
import styles from './styles.module.css';

export default function PasswordProtected({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

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
        <h2>需要密码访问</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="请输入密码"
            className={styles.passwordInput}
          />
          {error && <div className={styles.error}>密码错误</div>}
          <button type="submit" className={styles.submitButton}>
            确认
          </button>
        </form>
      </div>
    </div>
  );
} 
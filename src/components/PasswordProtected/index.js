import React, { useState, useEffect } from 'react';
import { setAuthenticated } from '@site/src/utils/auth';
import styles from './styles.module.css';
import clsx from 'clsx';
import ReactDOM from 'react-dom';

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
        document.body.classList.remove('locked');
      } else {
        document.body.classList.add('locked');
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
      document.body.classList.add('locked');
    } else {
      document.body.classList.remove('locked');
      // 移除所有限制
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.style.removeProperty('pointer-events');
        const elements = mainContent.getElementsByTagName('*');
        Array.from(elements).forEach(element => {
          element.style.removeProperty('pointer-events');
          element.style.removeProperty('user-select');
          element.removeAttribute('unselectable');
          element.style.removeProperty('-webkit-user-select');
          element.style.removeProperty('-moz-user-select');
          element.style.removeProperty('-ms-user-select');
          if (element.tagName === 'A') {
            element.style.removeProperty('pointer-events');
          }
        });
      }
      onSuccess?.();
    }
  };

  // 添加禁用交互的效果
  useEffect(() => {
    if (!isClient || setAuthenticated('')) return; // 如果已经验证通过，不添加限制

    // 禁用所有元素的交互
    const disableInteraction = (element) => {
      // 只处理主内容区域，排除密码框
      const mainContent = document.querySelector('main');
      const authContainer = document.querySelector(`.${styles.authContainer}`);
      
      if (!mainContent?.contains(element) || (authContainer?.contains(element))) {
        return;
      }
      
      element.style.setProperty('pointer-events', 'none', 'important');
      element.style.setProperty('user-select', 'none', 'important');
      element.setAttribute('unselectable', 'on');
      element.style.setProperty('-webkit-user-select', 'none', 'important');
      element.style.setProperty('-moz-user-select', 'none', 'important');
      element.style.setProperty('-ms-user-select', 'none', 'important');
      
      if (element.tagName === 'A') {
        element.style.setProperty('pointer-events', 'none', 'important');
        element.removeAttribute('href');
      }
    };

    // 递归处理所有子元素
    const processElement = (element) => {
      const authContainer = document.querySelector(`.${styles.authContainer}`);
      // 如果是密码框或其子元素，完全跳过
      if (authContainer?.contains(element)) {
        return;
      }
      disableInteraction(element);
      Array.from(element.children).forEach(child => {
        if (!authContainer?.contains(child)) {
          processElement(child);
        }
      });
    };

    // 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            const authContainer = document.querySelector(`.${styles.authContainer}`);
            if (!authContainer?.contains(node)) {
              processElement(node);
            }
          }
        });
      });
    });

    // 初始化禁用
    const root = document.documentElement;
    processElement(root);

    // 开始监听
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 禁用全局事件
    const preventEvent = (e) => {
      const authContainer = document.querySelector(`.${styles.authContainer}`);
      // 如果事件来自密码框或其子元素，直接返回
      if (authContainer?.contains(e.target)) {
        return;
      }
      
      const mainContent = document.querySelector('main');
      if (!mainContent?.contains(e.target)) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // 添加全局事件监听
    const events = ['copy', 'cut', 'paste', 'contextmenu', 'selectstart', 'mousedown', 'click', 'dblclick'];
    events.forEach(event => {
      document.addEventListener(event, preventEvent, true);
    });

    // 禁用快捷键
    document.addEventListener('keydown', (e) => {
      const mainContent = document.querySelector('main');
      // 只处理主内容区域内的事件
      if (!mainContent?.contains(e.target) || e.target.closest(`.${styles.authContainer}`)) {
        return;
      }
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        return false;
      }
    }, true);

    return () => {
      observer.disconnect();
      events.forEach(event => {
        document.removeEventListener(event, preventEvent, true);
      });
    };
  }, [isClient]);

  // 在初始检查完成之前不渲染任何内容
  if (isInitialCheck) {
    return null;
  }

  // 只在客户端渲染
  if (!isClient) {
    return null;
  }

  // 使用 React Portal 将密码框渲染到 body
  return ReactDOM.createPortal(
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
    </div>,
    document.body
  );
} 
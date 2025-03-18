import React, { useEffect } from 'react';
import DocSidebar from '@theme-original/DocSidebar';

export default function DocSidebarWrapper(props) {
  useEffect(() => {
    const handlePopState = () => {
      // 检查sidebar是否处于打开状态
      const isSidebarOpened = document.body.hasAttribute('data-sidebar-opened');
      if (!isSidebarOpened) return;

      // 移除sidebar打开状态
      document.body.removeAttribute('data-sidebar-opened');
      // 移除遮罩层
      const overlay = document.querySelector('.navbar-sidebar__backdrop');
      if (overlay && !overlay.classList.contains('removing')) {
        overlay.classList.add('removing');
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
        }, 200);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return <DocSidebar {...props} />;
}
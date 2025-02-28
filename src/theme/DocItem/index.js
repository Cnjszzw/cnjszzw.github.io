import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';
import DocItem from '@theme-original/DocItem';
import { isProtectedPath, isAuthenticated } from '@site/src/utils/auth';
import PasswordProtected from '@site/src/components/PasswordProtected';

export default function DocItemWrapper(props) {
  const location = useLocation();
  const [isAuthed, setIsAuthed] = useState(isAuthenticated());
  const needsAuth = isProtectedPath(location.pathname);

  if (needsAuth && !isAuthed) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ filter: 'blur(5px)' }}>
          <DocItem {...props} />
        </div>
        <PasswordProtected onSuccess={() => setIsAuthed(true)} />
      </div>
    );
  }

  return <DocItem {...props} />;
}

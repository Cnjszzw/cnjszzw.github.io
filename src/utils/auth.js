// 密码保护的路径列表
export const protectedPaths = [
  '/docs/interviewDoc'
];

// 生成密码的函数
export const generatePassword = () => {
  return '123';
};

// 本地存储的key
export const AUTH_STORAGE_KEY = 'docusaurus-auth';

// 检查路径是否需要密码保护
export const isProtectedPath = (pathname) => {
  return protectedPaths.some(path => pathname.startsWith(path));
};

// 检查是否已认证
export const isAuthenticated = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored === generatePassword();
  } catch {
    return false;
  }
};

// 设置认证状态
export const setAuthenticated = (password) => {
  if (password === generatePassword()) {
    localStorage.setItem(AUTH_STORAGE_KEY, password);
    return true;
  }
  return false;
}; 
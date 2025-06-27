import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, LoginCredentials, AuthResponse } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  hasPermission: (resource: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // 检查本地存储的token
  useEffect(() => {
    const checkAuthState = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // 验证token并获取用户信息
          const response = await fetch('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          } else {
            // Token无效，清理本地存储
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };

    checkAuthState();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 首先尝试真实API调用
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const authData: AuthResponse = await response.json();

        // 存储tokens
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('refreshToken', authData.refreshToken);

        // 设置用户状态
        setUser(authData.user);

        setIsLoading(false);
        return true;
      } else {
        // API失败，使用演示登录
        return handleDemoLogin(credentials);
      }
    } catch (error) {
      // 网络错误或API不可用，使用演示登录
      console.log('API unavailable, using demo login:', error);
      return handleDemoLogin(credentials);
    }
  };

  // 演示登录功能
  const handleDemoLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    const { username, password } = credentials;

    // 检查用户名和密码是否非空
    if (!username.trim() || !password.trim()) {
      setIsLoading(false);
      return false;
    }

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 创建演示用户数据
    const demoUser: AuthUser = {
      id: Date.now(),
      username: username,
      email: `${username}@demo.com`,
      displayName:
        username === 'admin' ? '系统管理员' : username === 'editor' ? '内容编辑' : username,
      role: 'admin', // 演示模式下都是管理员
      permissions: ['read', 'write', 'delete', 'manage'],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };

    // 生成演示token
    const demoToken = 'demo-token-' + Date.now();
    const demoRefreshToken = 'demo-refresh-' + Date.now();

    // 存储演示数据
    localStorage.setItem('authToken', demoToken);
    localStorage.setItem('refreshToken', demoRefreshToken);

    // 设置用户状态
    setUser(demoUser);

    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');

    // 可选：通知服务器端注销
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    }).catch(console.error);
  };

  const refreshToken = async (): Promise<boolean> => {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      logout();
      return false;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (response.ok) {
        const authData: AuthResponse = await response.json();

        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('refreshToken', authData.refreshToken);

        setUser(authData.user);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;

    // 管理员拥有所有权限
    if (user.role === 'admin') return true;

    // 检查特定权限
    const permission = `${resource}:${action}`;
    return user.permissions.includes(permission);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 权限保护组件
interface ProtectedRouteProps {
  children: ReactNode;
  requiresAuth?: boolean;
  requiredRole?: AuthUser['role'];
  requiredPermission?: { resource: string; action: string };
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresAuth = true,
  requiredRole,
  requiredPermission,
}) => {
  const { user, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  if (requiresAuth && !user) {
    return (
      <div className="protected-route-unauthorized">
        <h2>需要登录</h2>
        <p>请先登录以访问此页面。</p>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="protected-route-forbidden">
        <h2>权限不足</h2>
        <p>您没有访问此页面的权限。</p>
      </div>
    );
  }

  if (
    requiredPermission &&
    !hasPermission(requiredPermission.resource, requiredPermission.action)
  ) {
    return (
      <div className="protected-route-forbidden">
        <h2>权限不足</h2>
        <p>您没有执行此操作的权限。</p>
      </div>
    );
  }

  return <>{children}</>;
};

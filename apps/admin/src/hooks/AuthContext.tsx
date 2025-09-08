import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getCurrentUser, login } from '../apis';
import { AuthContext } from './AuthContext';
import type { LoginDto } from '../request/globals';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await getCurrentUser();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (data: LoginDto): Promise<boolean> => {
    try {
      const response = await login(data);
      console.log('Login response:', response); // 调试信息

      // 检查响应数据结构
      const token = response.data?.accessToken;
      const userData = response.data?.user;

      if (token) {
        localStorage.setItem('token', token);
        if (userData) {
          setUser(userData);
        } else {
          await checkAuth();
        }
        message.success('登录成功');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error); // 调试信息
      message.error(error.message || '登录失败');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    message.success('已退出登录');
  };

  const value: any = {
    user,
    loading,
    login: handleLogin,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

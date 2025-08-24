'use client';
import { useState, useEffect } from 'react';
import { useStars } from '@/hooks/useStarts';
import Link from 'next/link';
import { message } from 'antd';
import Apis from '@/request';
import LoginModal from './LoginModal';
import Navigation from './Navigation';
import GitHubStarButton from './GitHubStarButton';
import UserSection from './UserSection';
import type { DisplayHeaderProps } from './types';
import { useUserStore } from '@/store/user.store';
import { LoginDto, RegisterDto } from '@/request/globals';

const DisplayHeader = ({ activeItem }: DisplayHeaderProps) => {
  const stars = useStars();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser, setToken } = useUserStore();

  // 初始化时检查localStorage中的用户信息
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');

    if (token && userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
        setToken(token);
        setIsLoggedIn(true);
      } catch (error) {
        // 如果解析失败，清除无效数据
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
      }
    }
  }, [setUser, setToken]);

  const handleLogin = async (
    data: LoginDto | RegisterDto,
    isLogin: boolean
  ) => {
    try {
      let response;

      if (isLogin) {
        // 登录
        response = await Apis.general.AuthController_login({
          data: data as LoginDto
        });
      } else {
        // 注册
        response = await Apis.general.AuthController_register({
          data: data as RegisterDto
        });
      }

      const authData = response;

      // 保存token到localStorage
      localStorage.setItem('token', authData.accessToken);

      // 保存用户信息到localStorage
      localStorage.setItem('userInfo', JSON.stringify(authData.user));

      // 更新状态
      setUser(authData.user);
      setToken(authData.accessToken);
      setIsLoggedIn(true);

      // 显示成功消息
      message.success(isLogin ? '登录成功' : '注册成功');

      return authData;
    } catch (error: any) {
      // 处理错误
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (isLogin ? '登录失败' : '注册失败');
      message.error(errorMessage);
      throw error;
    }
  };

  const handleLogout = () => {
    // 清除localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');

    // 清除状态
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);

    message.success('已退出登录');
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost/auth/github';
  };

  return (
    <header className='h-[80px] pt-12 z-50 relative'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        <Link
          href='/'
          className='flex items-center space-x-2 text-white transition-colors duration-200'
        >
          <div className='w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-white text-black'>
            T
          </div>
          <span className='font-semibold text-lg hidden sm:block'>Typing</span>
        </Link>

        <div className='flex items-center space-x-8'>
          <Navigation activeItem={activeItem} />
          <GitHubStarButton stars={stars} />
          <UserSection
            user={user}
            isLoggedIn={isLoggedIn}
            onLoginClick={openLoginModal}
            onLogoutClick={handleLogout}
          />
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLogin={handleLogin}
        onGithubLogin={handleGithubLogin}
      />
    </header>
  );
};

export default DisplayHeader;

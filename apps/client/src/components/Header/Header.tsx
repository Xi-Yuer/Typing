'use client';
import { useState } from 'react';
import { useStars } from '@/hooks/useStarts';
import Link from 'next/link';
import { message } from 'antd';
import Apis from '@/request';
import LoginModal from './LoginModal';
import Navigation from './Navigation';
import GitHubStarButton from './GitHubStarButton';
import UserSection from './UserSection';
import type { DisplayHeaderProps } from './types';
import { useUserStore, useHydrateUserStore } from '@/store/user.store';
import { LoginDto, RegisterDto } from '@/request/globals';
import logo from '@/app/favicon.ico';

const DisplayHeader = ({ activeItem }: DisplayHeaderProps) => {
  const { stars } = useStars();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, setUser, setToken } = useUserStore();
  const [messageApi, messageContext] = message.useMessage();
  useHydrateUserStore();

  // 根据用户状态确定是否已登录
  const isLoggedIn = !!user;

  const handleLogin = async (
    data: LoginDto | RegisterDto,
    isLogin: boolean
  ) => {
    try {
      let response: any;

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

      // 检查响应结构
      if (!response || !response.data) {
        throw new Error(response?.data?.message || '响应数据格式错误');
      }

      // 后端返回的是统一响应格式，实际数据在 response.data 中
      const authData = response.data;
      const { accessToken, user } = authData;

      if (!accessToken || !user) {
        throw new Error(authData.message || '登录数据不完整');
      }

      // 更新状态
      setUser(user);
      setToken(accessToken);

      // 显示成功消息
      messageApi.success(isLogin ? '登录成功' : '注册成功');

      return response;
    } catch (error: any) {
      // 处理错误
      let errorMessage = isLogin ? '登录失败' : '注册失败';

      if (error?.response?.data) {
        // 检查是否是统一响应格式的错误
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.data?.message) {
          errorMessage = error.response.data.data.message;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      messageApi.error(errorMessage);
      throw error;
    }
  };

  const handleLogout = () => {
    // 清除状态
    setUser(null);
    setToken(null);

    messageApi.success('已退出登录');
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <header className='pt-12 pb-2 z-100 w-screen backdrop-blur-md'>
      {messageContext}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        <Link
          href='/'
          className='flex items-center space-x-2 text-white transition-colors duration-200'>
          <div className='w-10 h-10 rounded-lg p-2 flex items-center justify-center font-bold text-sm bg-white text-black'>
            <img src={logo.src} alt='logo' className='w-full h-full' />
          </div>
          <span className='font-semibold text-lg hidden sm:block'>
            咔西咔西
          </span>
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
      />
    </header>
  );
};

export default DisplayHeader;

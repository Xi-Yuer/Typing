'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useStars } from '@/hooks/useStarts';
import star from '@/assets/common/star.svg';
import Link from 'next/link';
import Image from 'next/image';
import { Modal, message } from 'antd';
import Apis from '@/request';
import {
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  GithubOutlined
} from '@ant-design/icons';

const DisplayHeader = ({ activeItem }: { activeItem: string }) => {
  const navRef = useRef(null);
  const starCountRef = useRef(null);
  const stars = useStars();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({
    username: '',
    password: ''
  });

  const navList = [
    {
      name: 'Home',
      href: '/'
    },
    {
      name: 'Docs',
      href: '/text-animations/split-text'
    },
    {
      name: 'Showcase',
      href: '/showcase'
    }
  ];

  useEffect(() => {
    if (stars && starCountRef.current) {
      gsap.fromTo(
        starCountRef.current,
        {
          scale: 0,
          width: 0,
          opacity: 0
        },
        {
          scale: 1,
          width: '100px',
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1)'
        }
      );
    }
  }, [stars]);

  const handleLogin = () => {};

  const handleLogout = () => {};

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginData({ username: '', password: '' });
    setLoginErrors({ username: '', password: '' });
  };

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (loginErrors[field]) {
      setLoginErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost/auth/github';
  };

  return (
    <header className='h-[80px] pt-12 z-50 relative'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        <Link
          href='/'
          className='flex items-center space-x-2 text-white transition-colors duration-200'>
          <div className='w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-white text-black'>
            T
          </div>
          <span className='font-semibold text-lg hidden sm:block'>Typing</span>
        </Link>

        <div className='flex items-center space-x-8'>
          <nav className='flex items-center space-x-6' ref={navRef}>
            <div className='flex items-center justify-between p-4 px-8 rounded-4xl backdrop-blur-2xl text-white gap-10 border border-white/10'>
              {navList.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={
                    activeItem === item.name.toLowerCase()
                      ? 'active-link opacity-100'
                      : 'opacity-80'
                  }>
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          <Link
            target='_blank'
            className='flex items-center justify-between py-1 px-4 rounded-4xl backdrop-blur-2xl text-white gap-2 border border-white/10 bg-gradient-to-r from-[#7c3aed] to-[#bb5dee] '
            style={{
              animationDuration: '6s'
            }}
            href='https://github.com/Xi-Yuer/Typing'>
            <span>Star On GitHub</span>
            <div
              ref={starCountRef}
              style={{ opacity: 1 }}
              className='flex items-center justify-center space-x-2 bg-black py-3 px-5 rounded-4xl'>
              <Image src={star} alt='Star Icon' width={16} height={16} />
              <span>{stars}</span>
            </div>
          </Link>
          {/* 登录/用户信息区域 */}
          {false ? (
            <>
              <div className='flex items-center justify-center p-3 px-6 rounded-4xl backdrop-blur-2xl text-white border border-white/10 cursor-pointer hover:bg-white/10 transition-colors'>
                <UserOutlined className='mr-2' />
                <span>用户</span>
              </div>
            </>
          ) : (
            <div
              onClick={openLoginModal}
              className='flex items-center justify-center p-3 px-6 rounded-4xl backdrop-blur-2xl text-white border border-white/10 cursor-pointer hover:bg-white/10 transition-colors'>
              <UserOutlined className='mr-2' />
              <span>登录</span>
            </div>
          )}
        </div>
      </div>

      {/* 登录弹窗 */}
      <Modal
        title={null}
        open={isLoginModalOpen}
        onCancel={closeLoginModal}
        footer={null}
        width={400}
        centered
        styles={{
          content: {
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px'
          }
        }}>
        <div className='p-6'>
          <div className='text-center mb-8'>
            <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#bb5dee] flex items-center justify-center'>
              <UserOutlined className='text-2xl text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white mb-2'>欢迎回来</h2>
            <p className='text-white/70'>请登录您的账户</p>
          </div>

          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50'>
                  <UserOutlined />
                </div>
                <input
                  type='text'
                  placeholder='用户名'
                  value={loginData.username}
                  onChange={e => handleInputChange('username', e.target.value)}
                  className={`w-full h-12 pl-10 pr-4 bg-white/10 border rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all ${
                    loginErrors.username ? 'border-red-400' : 'border-white/20'
                  }`}
                />
              </div>
              {loginErrors.username && (
                <p className='text-red-400 text-sm mt-1 ml-1'>
                  {loginErrors.username}
                </p>
              )}
            </div>

            <div>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50'>
                  <LockOutlined />
                </div>
                <input
                  type='password'
                  placeholder='密码'
                  value={loginData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  className={`w-full h-12 pl-10 pr-4 bg-white/10 border rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all ${
                    loginErrors.password ? 'border-red-400' : 'border-white/20'
                  }`}
                />
              </div>
              {loginErrors.password && (
                <p className='text-red-400 text-sm mt-1 ml-1'>
                  {loginErrors.password}
                </p>
              )}
            </div>

            <button
              type='submit'
              className='w-full h-12 mt-6 bg-gradient-to-r from-[#7c3aed] to-[#bb5dee] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:ring-offset-2 focus:ring-offset-transparent'>
              登录
            </button>
          </form>

          {/* 分割线 */}
          <div className='flex items-center my-6'>
            <div className='flex-1 h-px bg-white/20'></div>
            <span className='px-4 text-white/50 text-sm'>或</span>
            <div className='flex-1 h-px bg-white/20'></div>
          </div>

          {/* GitHub登录按钮 */}
          <button
            onClick={handleGithubLogin}
            className='w-full h-12 bg-[#24292e] hover:bg-[#1a1e22] text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#24292e] focus:ring-offset-2 focus:ring-offset-transparent flex items-center justify-center gap-3'>
            <GithubOutlined className='text-lg' />
            使用 GitHub 登录
          </button>

          <div className='text-center mt-6'>
            <p className='text-white/50 text-sm'>
              还没有账户？
              <span className='text-[#7c3aed] cursor-pointer hover:text-[#bb5dee] ml-1'>
                立即注册
              </span>
            </p>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default DisplayHeader;

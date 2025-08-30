'use client';
import { useState } from 'react';
import { Modal } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined } from '@ant-design/icons';
import type { LoginErrors, LoginModalProps } from './types';
import { LoginDto, RegisterDto } from '@/request/globals';
import Link from 'next/link';

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginData, setLoginData] = useState<LoginDto>({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState<RegisterDto>({
    name: '',
    email: '',
    password: ''
  });
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({
    email: '',
    password: ''
  });
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({
    name: '',
    email: '',
    password: ''
  });

  const handleClose = () => {
    onClose();
    setLoginData({ email: '', password: '' });
    setRegisterData({
      name: '',
      email: '',
      password: ''
    });
    setLoginErrors({ email: '', password: '' });
    setRegisterErrors({});
    setIsRegisterMode(false);
  };

  const handleInputChange = (field: string, value: string) => {
    if (isRegisterMode) {
      setRegisterData(prev => ({ ...prev, [field]: value }));
      if (registerErrors[field as keyof RegisterErrors]) {
        setRegisterErrors(prev => ({ ...prev, [field]: undefined }));
      }
    } else {
      setLoginData(prev => ({ ...prev, [field]: value }));
      if (loginErrors[field as keyof LoginErrors]) {
        setLoginErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const validateLoginForm = (): boolean => {
    const newErrors: LoginErrors = { email: '', password: '' };
    let isValid = true;

    if (!loginData.email.trim()) {
      newErrors.email = '邮箱不能为空';
      isValid = false;
    }

    if (!loginData.password) {
      newErrors.password = '密码不能为空';
      isValid = false;
    } else if (loginData.password.length < 6) {
      newErrors.password = '密码长度至少6位';
      isValid = false;
    }

    setLoginErrors(newErrors);
    return isValid;
  };

  const validateRegisterForm = (): boolean => {
    const newErrors: RegisterErrors = {};
    let isValid = true;

    if (!registerData.name.trim()) {
      newErrors.name = '用户名不能为空';
      isValid = false;
    } else if (registerData.name.length < 3) {
      newErrors.name = '用户名长度至少3位';
      isValid = false;
    }

    if (!registerData.email.trim()) {
      newErrors.email = '邮箱不能为空';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = '邮箱格式不正确';
      isValid = false;
    }

    if (!registerData.password) {
      newErrors.password = '密码不能为空';
      isValid = false;
    } else if (registerData.password.length < 6) {
      newErrors.password = '密码长度至少6位';
      isValid = false;
    }

    setRegisterErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegisterMode) {
      if (validateRegisterForm()) {
        const userData: RegisterDto = {
          name: registerData.name,
          email: registerData.email,
          password: registerData.password
        };
        await onLogin(userData, false);
        handleClose();
      }
    } else {
      if (validateLoginForm()) {
        await onLogin(loginData, true);
        handleClose();
      }
    }
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={420}
      centered
      styles={{
        content: {
          background:
            'linear-gradient(135deg, rgba(15, 20, 35, 0.95) 0%, rgba(25, 30, 50, 0.9) 100%)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '28px',
          boxShadow:
            '0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.05)',
          overflow: 'hidden',
          padding: 0
        },
        body: {
          padding: 0
        },
        mask: {
          backdropFilter: 'blur(8px)'
        }
      }}
    >
      <div className='p-10 relative'>
        {/* 背景装饰 */}
        <div className='absolute inset-0 bg-gradient-to-br from-slate-800/20 via-blue-900/10 to-indigo-900/20 backdrop-blur-sm pointer-events-none'></div>

        <div className='text-center mb-8 relative z-10'>
          <h2 className='text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent mb-3'>
            {isRegisterMode ? '创建账户' : '欢迎回来'}
          </h2>
          <p className='text-white/60 text-lg'>
            {isRegisterMode ? '请填写注册信息' : '请登录您的账户'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4 relative z-10'>
          {isRegisterMode ? (
            // 注册表单
            <>
              <div className='group'>
                <div className='relative'>
                  <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 group-focus-within:text-blue-300 transition-colors duration-200'>
                    <UserOutlined />
                  </div>
                  <input
                    type='text'
                    placeholder='用户名'
                    autoComplete='off'
                    value={registerData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    className={`w-full h-12 pl-12 pr-4 bg-white/5 border rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8 ${
                      registerErrors.email
                        ? 'border-red-400/60 bg-red-500/10'
                        : 'border-white/10'
                    }`}
                  />
                  <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                </div>
                {registerErrors.name && (
                  <p className='text-red-300 text-sm mt-2 ml-2 animate-pulse'>
                    {registerErrors.name}
                  </p>
                )}
              </div>

              <div className='group'>
                <div className='relative'>
                  <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 group-focus-within:text-blue-300 transition-colors duration-200'>
                    <UserOutlined />
                  </div>
                  <input
                    type='email'
                    placeholder='邮箱'
                    autoComplete='off'
                    value={registerData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className={`w-full h-12 pl-12 pr-4 bg-white/5 border rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8 ${
                      registerErrors.email
                        ? 'border-red-400/60 bg-red-500/10'
                        : 'border-white/10'
                    }`}
                  />
                  <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                </div>
                {registerErrors.email && (
                  <p className='text-red-300 text-sm mt-2 ml-2 animate-pulse'>
                    {registerErrors.email}
                  </p>
                )}
              </div>

              <div className='group'>
                <div className='relative'>
                  <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 group-focus-within:text-blue-300 transition-colors duration-200'>
                    <LockOutlined />
                  </div>
                  <input
                    type='password'
                    placeholder='密码'
                    autoComplete='off'
                    value={registerData.password}
                    onChange={e =>
                      handleInputChange('password', e.target.value)
                    }
                    className={`w-full h-12 pl-12 pr-4 bg-white/5 border rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8 ${
                      registerErrors.password
                        ? 'border-red-400/60 bg-red-500/10'
                        : 'border-white/10'
                    }`}
                  />
                  <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                </div>
                {registerErrors.password && (
                  <p className='text-red-300 text-sm mt-2 ml-2 animate-pulse'>
                    {registerErrors.password}
                  </p>
                )}
              </div>

              {registerErrors.general && (
                <div className='bg-red-500/10 border border-red-400/30 rounded-xl p-3 mt-2'>
                  <p className='text-red-300 text-sm text-center animate-pulse'>
                    {registerErrors.general}
                  </p>
                </div>
              )}
            </>
          ) : (
            // 登录表单
            <>
              <div className='group'>
                <div className='relative'>
                  <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 group-focus-within:text-blue-300 transition-colors duration-200'>
                    <UserOutlined />
                  </div>
                  <input
                    type='email'
                    placeholder='邮箱'
                    autoComplete='off'
                    value={loginData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className={`w-full h-12 pl-12 pr-4 bg-white/5 border rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8 ${
                      loginErrors.email
                        ? 'border-red-400/60 bg-red-500/10'
                        : 'border-white/10'
                    }`}
                  />
                  <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                </div>
                {loginErrors.email && (
                  <p className='text-red-300 text-sm mt-2 ml-2 animate-pulse'>
                    {loginErrors.email}
                  </p>
                )}
              </div>

              <div className='group'>
                <div className='relative'>
                  <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 group-focus-within:text-blue-300 transition-colors duration-200'>
                    <LockOutlined />
                  </div>
                  <input
                    type='password'
                    placeholder='密码'
                    autoComplete='off'
                    value={loginData.password}
                    onChange={e =>
                      handleInputChange('password', e.target.value)
                    }
                    className={`w-full h-12 pl-12 pr-4 bg-white/5 border rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8 ${
                      loginErrors.password
                        ? 'border-red-400/60 bg-red-500/10'
                        : 'border-white/10'
                    }`}
                  />
                  <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                </div>
                {loginErrors.password && (
                  <p className='text-red-300 text-sm mt-2 ml-2 animate-pulse'>
                    {loginErrors.password}
                  </p>
                )}
              </div>
            </>
          )}

          <button
            type='submit'
            className='w-full h-12 mt-6 bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#c084fc] text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-transparent relative overflow-hidden group'
          >
            <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            <span className='relative z-10 text-lg'>
              {isRegisterMode ? '注册' : '登录'}
            </span>
          </button>
        </form>

        {/* 分割线 */}
        <div className='flex items-center my-6 relative z-10'>
          <div className='flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent'></div>
          <span className='px-6 text-white/60 text-sm font-medium'>或</span>
          <div className='flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent'></div>
        </div>

        {/* GitHub登录按钮 */}
        <Link
          href={process.env.NEXT_PUBLIC_GITHUB_SSO_URL as string}
          className='w-full h-12 bg-gradient-to-r from-[#24292e] to-[#1a1e22] hover:from-[#1a1e22] hover:to-[#0d1117] !text-white font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-transparent flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-gray-900/30 hover:scale-[1.02] active:scale-[0.98] relative z-10 group overflow-hidden'
        >
          <div className='absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          <GithubOutlined className='text-xl relative z-10' />
          <span className='relative z-10'>使用 GitHub 登录</span>
        </Link>

        <div className='text-center mt-6 relative z-10'>
          <p className='text-white/60 text-sm'>
            {isRegisterMode ? '已有账户？' : '还没有账户？'}
            <span
              className='text-purple-400 cursor-pointer hover:text-purple-300 ml-2 font-medium transition-all duration-200 hover:underline underline-offset-2'
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                // 清除错误信息
                setLoginErrors({ email: '', password: '' });
                setRegisterErrors({});
              }}
            >
              {isRegisterMode ? '登录' : '注册'}
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;

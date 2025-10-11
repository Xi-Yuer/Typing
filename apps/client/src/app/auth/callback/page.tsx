'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Apis from '@/request';
import { useUserStore } from '@/store/user.store';

const AuthCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken } = useUserStore();

  const handleAuthCallback = async () => {
    try {
      // 从URL参数中获取token
      const token = searchParams.get('token');

      if (!token) {
        router.push('/');
        return;
      }

      // 使用token获取用户信息
      const userResponse = await Apis.general.UserController_findMe();

      if (userResponse) {
        // 更新用户状态
        setUser(userResponse.data);
        setToken(token);

        // 重定向到首页
        router.push('/');
      } else {
        throw new Error('获取用户信息失败');
      }
    } catch {
      // 清除可能存在的无效状态
      setUser(null);
      setToken(null);
      router.push('/');
    }
  };

  useEffect(() => {
    handleAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, searchParams]);

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
        <p className='text-white text-lg'>正在处理登录信息...</p>
      </div>
    </div>
  );
};

const AuthCallback = () => {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
            <p className='text-white text-lg'>正在加载...</p>
          </div>
        </div>
      }>
      <AuthCallbackContent />
    </Suspense>
  );
};

export default AuthCallback;

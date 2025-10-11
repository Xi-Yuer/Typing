'use client';
import { UserOutlined } from '@ant-design/icons';
import type { UserSectionProps } from './types';
import { Dropdown } from 'antd';

const UserSection = ({
  user,
  isLoggedIn,
  onLoginClick,
  onLogoutClick
}: UserSectionProps) => {
  if (isLoggedIn && user) {
    return (
      <Dropdown
        trigger={['hover']}
        menu={{
          items: [
            {
              label: (
                <span
                  onClick={onLogoutClick}
                  className='cursor-pointer inline-block mx-3'>
                  退出登录
                </span>
              ),
              key: 'logout'
            }
          ]
        }}>
        <div className='flex items-center justify-center p-1.5 sm:p-2 lg:p-2.5 px-2 sm:px-4 lg:px-5 lg:py-4 rounded-4xl backdrop-blur-2xl text-white border border-white/10 cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap'>
          <UserOutlined className='mr-1 text-xs sm:text-sm lg:text-sm' />
          <span className='text-xs sm:text-sm lg:text-sm max-w-16 sm:max-w-24 lg:max-w-none truncate'>
            {user.name}
          </span>
        </div>
      </Dropdown>
    );
  }

  return (
    <div
      onClick={onLoginClick}
      className='flex items-center justify-center p-1.5 sm:p-2 lg:p-2.5 px-2 sm:px-4 lg:px-5 rounded-4xl backdrop-blur-2xl text-white border border-white/10 cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap'>
      <UserOutlined className='mr-1 text-xs sm:text-sm lg:text-sm' />
      <span className='text-xs sm:text-sm lg:text-sm'>登录</span>
    </div>
  );
};

export default UserSection;

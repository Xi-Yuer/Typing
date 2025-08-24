'use client';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
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
                  className='cursor-pointer inline-block mx-3'
                >
                  退出登录
                </span>
              ),
              key: 'logout'
            }
          ]
        }}
      >
        <div className='flex items-center justify-center p-3 px-6 rounded-4xl backdrop-blur-2xl text-white border border-white/10 cursor-pointer hover:bg-white/10 transition-colors'>
          <UserOutlined className='mr-2' />
          <span>{user.name}</span>
        </div>
      </Dropdown>
    );
  }

  return (
    <div
      onClick={onLoginClick}
      className='flex items-center justify-center p-3 px-6 rounded-4xl backdrop-blur-2xl text-white border border-white/10 cursor-pointer hover:bg-white/10 transition-colors'
    >
      <UserOutlined className='mr-2' />
      <span>登录</span>
    </div>
  );
};

export default UserSection;

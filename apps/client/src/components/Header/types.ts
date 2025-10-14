// Header组件相关的类型定义

import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  UserResponseDto
} from '@/request/globals';

// 登录错误信息接口
export interface LoginErrors {
  email: string;
  password: string;
}

// 导航项接口
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

// Header组件属性接口
export interface DisplayHeaderProps {
  activeItem: string;
  user?: AuthResponseDto | null;
  onUserChange?: (user: AuthResponseDto | null) => void;
}

// 登录模态框属性接口
export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (
    data: LoginDto | RegisterDto,
    isLogin: boolean
  ) => Promise<AuthResponseDto> | void;
}

// 导航组件属性接口
export interface NavigationProps {
  activeItem: string;
  navItems?: NavItem[];
  className?: string;
}

// GitHub星标按钮属性接口
export interface GitHubStarButtonProps {
  stars: number | null;
  href?: string;
  loading?: boolean;
}

// 用户区域组件属性接口
export interface UserSectionProps {
  user?: UserResponseDto | null;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick?: () => void;
  loading?: boolean;
}

// API响应接口
export interface LoginResponse {
  success: boolean;
  user?: AuthResponseDto;
  token?: string;
  message?: string;
}

export interface GitHubStarsResponse {
  stargazers_count: number;
}

// Header组件统一导出
export { default as DisplayHeader } from './Header';
export { default as LoginModal } from './LoginModal';
export { default as Navigation } from './Navigation';
export { default as GitHubStarButton } from './GitHubStarButton';
export { default as UserSection } from './UserSection';
export { default as SearchBox } from './SearchBox';

// 类型导出
export type {
  LoginErrors,
  NavItem,
  DisplayHeaderProps,
  LoginModalProps,
  NavigationProps,
  GitHubStarButtonProps,
  UserSectionProps,
  LoginResponse,
  GitHubStarsResponse
} from './types';

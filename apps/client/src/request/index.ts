import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import { createApis, withConfigType, mountApis } from './createApis';

export const alovaInstance = createAlova({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  requestAdapter: fetchAdapter(),
  cacheFor: null,
  beforeRequest: method => {
    // 确保在浏览器环境中访问 localStorage
    if (typeof window !== 'undefined') {
      // 从Zustand store的localStorage中获取token
      const userStorage = localStorage.getItem('user-storage');
      let token = null;

      if (userStorage) {
        try {
          const parsed = JSON.parse(userStorage);
          token = parsed?.state?.token;
        } catch (error) {
          console.warn('Failed to parse user storage:', error);
        }
      }

      if (token) {
        method.config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
  },
  responded: async res => {
    // 其他情况返回 JSON
    const data = await res.json();
    if (data.code === 401) {
      // 确保在浏览器环境中访问 localStorage
      if (typeof window !== 'undefined') {
        // 清理Zustand store
        localStorage.removeItem('user-storage');
      }
    }
    return data;
  }
});

export const $$userConfigMap = withConfigType({});

const Apis = createApis(alovaInstance, $$userConfigMap);

mountApis(Apis);

export default Apis;

import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import { createApis, withConfigType, mountApis } from './createApis';

export const alovaInstance = createAlova({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  requestAdapter: fetchAdapter(),
  cacheFor: null,
  beforeRequest: method => {
    if (typeof window !== 'undefined') {
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
    return await res.json();
  }
});

export const $$userConfigMap = withConfigType({});

const Apis = createApis(alovaInstance, $$userConfigMap);

mountApis(Apis);

export default Apis;

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
      method.config.headers['Authorization'] =
        `Bearer ${localStorage.getItem('token')}`;
    }
  },
  responded: async res => {
    // 其他情况返回 JSON
    const data = await res.json();
    if (data.code === 401) {
      // 确保在浏览器环境中访问 localStorage
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    }
    return data;
  }
});

export const $$userConfigMap = withConfigType({});

const Apis = createApis(alovaInstance, $$userConfigMap);

mountApis(Apis);

export default Apis;

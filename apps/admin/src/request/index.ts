import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import { createApis, withConfigType, mountApis } from './createApis';

export const alovaInstance = createAlova({
  baseURL: '/api',
  requestAdapter: fetchAdapter(),
  beforeRequest: method => {
    const token = localStorage.getItem('token');
    if (token) {
      method.config.headers['Authorization'] = `Bearer ${token}`;
    }
  },
  responded: async res => {
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: '网络错误' }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }
    return res.json();
  }
});

export const $$userConfigMap = withConfigType({});

const Apis = createApis(alovaInstance, $$userConfigMap);

mountApis(Apis);

export default Apis;

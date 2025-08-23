import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import { createApis, withConfigType, mountApis } from './createApis';

export const alovaInstance = createAlova({
  baseURL: 'http://localhost',
  requestAdapter: fetchAdapter(),
  cacheFor: null,
  beforeRequest: method => {
    method.config.headers['Authorization'] =
      `Bearer ${localStorage.getItem('token')}`;
  },
  responded: async res => {
    // 其他情况返回 JSON
    return res.json();
  }
});

export const $$userConfigMap = withConfigType({});

const Apis = createApis(alovaInstance, $$userConfigMap);

mountApis(Apis);

export default Apis;

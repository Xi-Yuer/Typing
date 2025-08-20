import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import { createApis, withConfigType, mountApis } from './createApis';

export const alovaInstance = createAlova({
  baseURL: 'http://localhost',
  requestAdapter: fetchAdapter(),
  beforeRequest: method => {},
  responded: async res => {
    const contentType = res.headers.get('content-type') || '';
    // 如果是音频类型，返回 ArrayBuffer
    if (contentType.includes('audio/')) {
      return res.arrayBuffer();
    }
    // 其他情况返回 JSON
    return res.json();
  }
});

export const $$userConfigMap = withConfigType({});

const Apis = createApis(alovaInstance, $$userConfigMap);

mountApis(Apis);

export default Apis;

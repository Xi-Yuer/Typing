import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import { createApis, withConfigType, mountApis } from './createApis';

export const alovaInstance = createAlova({
  baseURL: 'http://localhost',
  requestAdapter: fetchAdapter(),
  beforeRequest: method => {
    method.config.headers['Authorization'] =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoiYWRtaW5AcXEuY29tIiwibmFtZSI6ImFkbWluIiwicm9sZSI6InN1cGVyX2FkbWluIiwic3RhdHVzIjoiYWN0aXZlIiwiaWF0IjoxNzU1MzU5OTI5LCJleHAiOjE3NTU5NjQ3Mjl9.BAHBaVHv1c3Mf-XPcO42AOvCbAF7i7N2nHFUBue78J4';
  },
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

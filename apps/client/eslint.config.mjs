import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    // Client 特定规则
    rules: {
      // 允许在客户端使用 console.log 进行调试
      'no-console': 'off',
      // React Hooks 相关
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];

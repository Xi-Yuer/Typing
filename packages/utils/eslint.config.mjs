import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    // 工具库代码特定规则（更严格）
    rules: {
      // 禁止在工具库代码中使用 console.log
      'no-console': 'error',
      // 要求函数有明确的返回类型
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },
];
// @ts-check
import baseConfig from '../../eslint.config.mjs';
import globals from 'globals';

export default [
  ...baseConfig,
  {
    // API 特定配置
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      sourceType: 'commonjs'
    }
  },
  {
    // API 特定规则
    rules: {
      // 允许在服务器端使用 console.log
      'no-console': 'off',
      // 允许未使用的变量（如果以下划线开头）
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];

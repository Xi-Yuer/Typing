// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * 统一的 ESLint 配置，适用于整个 monorepo
 * 包含 TypeScript、Prettier 和通用规则
 */
export default [
  {
    // 全局忽略文件
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/eslint.config.mjs'
    ]
  },
  // 基础 ESLint 推荐配置
  eslint.configs.recommended,
  // TypeScript ESLint 推荐配置（不包含类型检查）
  ...tseslint.configs.recommended,
  // Prettier 集成配置
  eslintPluginPrettierRecommended,
  {
    // 语言选项配置
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022
      }
    }
  },
  {
    // 通用规则配置
    rules: {
      // TypeScript 规则（仅不需要类型检查的规则）
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      
      // Prettier 规则
      'prettier/prettier': 'warn',
      
      // 通用规则
      'no-console': 'warn',
      'no-debugger': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error'
    }
  }
];
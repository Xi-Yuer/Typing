import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // 禁用 ESLint 检查
    ignoreDuringBuilds: true
  },
  typescript: {
    // 禁用 TypeScript 检查
    ignoreBuildErrors: true
  }
};

export default nextConfig;

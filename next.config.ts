import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  ...(isProd
    ? {
        // ===== 生产环境 =====
        basePath: '/blog',
        // assetPrefix 不建议在反代场景使用
        // assetPrefix: 'https://cdn.xxx.com',
      }
    : {
        // ===== 开发环境 =====
        basePath: '',
      }),
}

export default nextConfig

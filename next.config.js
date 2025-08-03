/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    // 支持的图片格式
    formats: ["image/webp", "image/avif"],
    // 图片尺寸配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 图片域名白名单
    domains: [
      "localhost",
      "tinyroom.dev",
      "images.unsplash.com",
      "via.placeholder.com",
    ],
    // 远程模式匹配 - 用于动态域名
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cloudflare.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
    // 启用图片优化
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天
  },

  // 服务器外部包
  serverExternalPackages: ["sharp"],

  // 编译配置
  compiler: {
    // 移除 console.log
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // 压缩配置
  compress: true,

  // 静态文件优化
  assetPrefix: process.env.NODE_ENV === "production" ? process.env.CDN_URL : "",

  // 重定向配置
  async redirects() {
    return [
      // 旧路径重定向
      {
        source: "/posts/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },

  // 头部配置
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 安全头部
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          // 性能头部
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          // API 缓存头部
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          // 静态资源缓存
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          // 图片缓存
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  // Webpack 配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      // 代码分割优化
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          // 第三方库分离
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            reuseExistingChunk: true,
          },
          // 公共组件分离
          common: {
            name: "common",
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };

      // Bundle 分析
      if (process.env.ANALYZE === "true") {
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: "bundle-analyzer-report.html",
          })
        );
      }
    }

    return config;
  },

  // 页面扩展名
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  // 跨域配置
  async rewrites() {
    return [
      // API 代理
      {
        source: "/api/proxy/:path*",
        destination: "https://api.example.com/:path*",
      },
    ];
  },

  // 尾随斜杠
  trailingSlash: false,

  // 严格模式
  reactStrictMode: true,

  // 电源偏好
  poweredByHeader: false,
};

module.exports = nextConfig;

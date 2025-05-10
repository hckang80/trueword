import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/request.ts');

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.getbible.net/v2/:path*'
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.christiantoday.co.kr'
      },
      {
        protocol: 'https',
        hostname: 'images.christiandaily.co.kr'
      },
      {
        protocol: 'https',
        hostname: 'www.kcnp.com'
      }
    ],
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif']
  },
  experimental: {
    viewTransition: true
  }
};

export default withNextIntl(nextConfig);

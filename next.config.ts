import { remotePatterns } from '@/entities/rss';
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
      ...remotePatterns,
      {
        protocol: 'https',
        hostname: 'i.ytimg.com'
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

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
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 's.w.org'
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com'
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com'
      },
      {
        protocol: 'https',
        hostname: 'videos.files.wordpress.com'
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

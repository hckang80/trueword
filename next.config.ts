import type { NextConfig } from 'next';
import { remotePatterns } from './src/shared/config';
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
    remotePatterns,
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif']
  },
  experimental: {
    viewTransition: true
  }
};

export default withNextIntl(nextConfig);

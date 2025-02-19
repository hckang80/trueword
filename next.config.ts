import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/v2/:path*',
        destination: 'https://api.getbible.net/v2/:path*'
      }
    ];
  }
};

export default nextConfig;

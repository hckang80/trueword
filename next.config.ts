import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.getbible.net/v2/:path*'
      }
    ];
  }
};

export default nextConfig;

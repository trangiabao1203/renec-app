/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    webUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:9010',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:9010/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

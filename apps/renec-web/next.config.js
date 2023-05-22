/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    webUrl: process.env.WEB_URL,
    apiUrl: process.env.API_URL
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`
      },
    ];
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable PostCSS
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.css$/i,
  //     use: ['style-loader', 'css-loader', 'postcss-loader'],
  //   });
  //
  //   return config;
  // },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9010/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

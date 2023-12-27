/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    //   appDir: true,
      serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
      domains: ['lh3.googleusercontent.com', 'img.freepik.com', 'veterinaire-tour-hassan.com'], // You can add or remove domains as needed
  },
  webpack(config) {
      config.module.rules.push({
          test: /\.node$/,
          use: 'raw-loader',
      });

      config.experiments = {
          ...config.experiments,
          topLevelAwait: true,
      }
      return config;
  }
}

module.exports = nextConfig;

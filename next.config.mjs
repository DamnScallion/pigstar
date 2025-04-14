/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // matches all paths
      },
    ],
  },
  productionBrowserSourceMaps: true,
};

export default nextConfig;

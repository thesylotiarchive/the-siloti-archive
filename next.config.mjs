/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',   // allow ALL https domains
      },
      {
        protocol: 'http',
        hostname: '**',   // if you want to allow http too
      },
    ],
  },
};

export default nextConfig;

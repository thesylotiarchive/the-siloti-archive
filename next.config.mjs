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
  env: {
    ACHIVE_PUBLIC_PAYPAL_CLIENT_ID: process.env.ACHIVE_PUBLIC_PAYPAL_CLIENT_ID,
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        "utfs.io",
        "i3.ytimg.com",
        "facebook.com",
        "www.facebook.com",   // ✅ add this
        "scontent.xx.fbcdn.net", // ✅ Facebook often serves images here
      ],
    },
};

export default nextConfig;

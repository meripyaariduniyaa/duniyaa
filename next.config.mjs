import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.resolve('.'),
  images: { remotePatterns: [{ protocol: 'https', hostname: '**.cloudinary.com' }] }
};

export default nextConfig;

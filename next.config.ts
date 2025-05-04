import type { NextConfig } from "next";
const path = require('path')

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs')
    }
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

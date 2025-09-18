import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // API routes (if needed) → no caching
        source: '/(.*)', // all routes
        headers: [
          {
            key: "Cache-Control",
            value: 'no-store, must-revalidate', // prevents browser caching
          },
        ],
      },
    ];
  },
};

export default nextConfig;
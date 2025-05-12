/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... your existing config
  webpack: (config, { isServer }) => {
    // Fixes pdfjs-dist webpack issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        canvas: false,
      };
    }
    return config;
  },
  // For increased API request body size limit (optional)
  api: {
    bodyParser: {
      sizeLimit: '12mb',
    },
  },
  // Optional: Configure CORS if needed
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

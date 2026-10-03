const API_BASE = process.env.API_BASE || "https://superbloom-academy-opal.vercel.app";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forms post to /api/* on this domain and are proxied to the Express backend,
  // so the browser never makes a cross-origin request.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_BASE}/api/:path*` }];
  },
  async redirects() {
    return [
      { source: "/apply", destination: "/admission", permanent: true },
      { source: "/certificate-perks", destination: "/streams", permanent: true },
      { source: "/courses", destination: "/streams", permanent: true },
    ];
  },
};

export default nextConfig;

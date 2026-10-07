const API_BASE = process.env.API_BASE || "https://superbloom-academy-opal.vercel.app";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // hide the Next.js badge shown in the corner while developing
  devIndicators: false,
  // Forms post to /api/* on this domain and are proxied to the Express backend,
  // so the browser never makes a cross-origin request.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_BASE}/api/:path*` }];
  },
  async redirects() {
    return [
      { source: "/apply", destination: "/admission", permanent: true },
      // merged into the About page
      { source: "/why-superbloom", destination: "/about", permanent: true },
      // URLs from the earlier versions of the site
      { source: "/certificate-perks", destination: "/programs", permanent: true },
      { source: "/streams", destination: "/programs", permanent: true },
      { source: "/streams/:category(engineering|pharmacy)", destination: "/programs/:category", permanent: true },
      { source: "/courses", destination: "/programs", permanent: true },
      { source: "/courses/:slug", destination: "/programs/pharmacy/:slug", permanent: true },
      { source: "/engineering", destination: "/programs/engineering", permanent: true },
      { source: "/pharmacy", destination: "/programs/pharmacy", permanent: true },
    ];
  },
};

export default nextConfig;

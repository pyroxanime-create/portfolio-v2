import type { NextConfig } from "next";

// Four projects were renamed. Old links keep working by pointing at the new names.
const RENAMED: [string, string][] = [
  ["atlas", "leeway"],
  ["kivo", "pare"],
  ["savora", "munchy"],
  ["vyra", "show-and-tell"],
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return RENAMED.flatMap(([from, to]) => [
      { source: `/work/${from}`, destination: `/work/${to}`, permanent: true },
      { source: `/${from}.html`, destination: `/${to}.html`, permanent: true },
    ]);
  },
};

export default nextConfig;

import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  eslint: {
    // This allows production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);

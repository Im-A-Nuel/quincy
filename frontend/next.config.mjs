/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // MiniPay runs inside an in-app WebView on low-end devices - keep output lean.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.ipfs.w3s.link" },
      { protocol: "https", hostname: "ipfs.io" },
    ],
  },
};

export default nextConfig;

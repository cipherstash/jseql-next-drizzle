import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cipherstash.com",
			},
		],
	},
};

export default nextConfig;

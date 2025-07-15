/** @type {import('next').NextConfig} */

// Hostname for pre-signed URLs from a private R2 bucket
const r2PreSignedUrlHostname =
	process.env.R2_BUCKET_NAME && process.env.CLOUDFLARE_ACCOUNT_ID
		? `${process.env.R2_BUCKET_NAME}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`
		: undefined;

// Hostname for the public R2 URL (if used)
const r2PublicHostname = process.env.R2_PUBLIC_URL
	? new URL(process.env.R2_PUBLIC_URL).hostname
	: undefined;

const remotePatterns = [
	{
		protocol: "https",
		hostname: "avatars.githubusercontent.com",
		port: "",
		pathname: "/u/**",
	},
];

if (r2PreSignedUrlHostname) {
	remotePatterns.push({
		protocol: "https",
		hostname: r2PreSignedUrlHostname,
		port: "",
		pathname: "/**",
	});
}

// Add the public hostname as well if it's different
if (r2PublicHostname && r2PublicHostname !== r2PreSignedUrlHostname) {
	remotePatterns.push({
		protocol: "https",
		hostname: r2PublicHostname,
		port: "",
		pathname: "/**",
	});
}

const nextConfig = {
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		typedRoutes: true,
	},
	images: {
		remotePatterns,
	},
};

export default nextConfig;

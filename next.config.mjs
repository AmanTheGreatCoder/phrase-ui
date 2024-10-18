/** @type {import('next').NextConfig} */
const nextConfig = {
	rewrites: async () => {
		return [
			{
				source: '/api/v1/:path*',
				destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
			},
		];
	},
};

export default nextConfig;

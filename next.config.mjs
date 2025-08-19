/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://192.168.31.228:3000',
        'http://192.168.31.41',
    ],
    // crossOrigin: 'anonymous',
    async headers() {
        return [
            {
                // Áp dụng cho tất cả file _next/static
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable', // cache lâu dài
                    },
                ],
            },
            {
                // Áp dụng cho các route API nếu cần
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=60, s-maxage=60, stale-while-revalidate=120',
                    },
                ],
            },
        ]
    },
}

export default nextConfig

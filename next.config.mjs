/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://192.168.31.228:3000',
        'http://192.168.31.41',
    ],
    async headers() {
        return [
            {
                source: '/favicon.ico',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                        // 1 năm, không đổi → client sẽ cache favicon
                    },
                ],
            },
        ]
    },

    // crossOrigin: 'anonymous',
}

export default nextConfig

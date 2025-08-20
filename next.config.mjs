/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://192.168.31.228:3000',
        'http://192.168.31.41',
    ],
    // crossOrigin: 'anonymous',
}

export default nextConfig

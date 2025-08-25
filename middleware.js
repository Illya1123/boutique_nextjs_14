import { auth } from '@/app/_lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
    const { pathname } = req.nextUrl
    const user = req.auth?.user

    // Nếu request đi vào /admin hoặc /api/admin
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        // Nếu chưa đăng nhập
        if (!user) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        // Nếu có đăng nhập nhưng không phải admin
        if (user.role !== 'admin') {
            return NextResponse.redirect(new URL('/home', req.url))
        }
    }

    // Redirect "/" sang "/home"
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/home', req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        '/', // Trang gốc
        '/admin/:path*', // Tất cả route /admin/*
        '/api/admin/:path*', // Tất cả API /api/admin/*
    ],
}

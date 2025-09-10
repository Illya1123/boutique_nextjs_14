import { auth } from '@/app/_lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
    const { pathname } = req.nextUrl
    const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')

    // Không có token/session
    if (isAdminRoute && !req.auth) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // Lấy role từ token trước, user sau (phòng khi session chưa hydrate)
    const role = req.auth?.token?.role ?? req.auth?.user?.role

    if (isAdminRoute) {
        if (role !== 'admin') {
            return NextResponse.redirect(new URL('/home', req.url))
        }
    }

    // Redirect từ "/" sang "/home"
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/home', req.url))
    }

    // Redirect từ "/account" sang "/account/profile"
    if (pathname === '/account') {
        return NextResponse.redirect(new URL('/account/profile', req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/', '/admin/:path*', '/api/admin/:path*', '/account'],
}

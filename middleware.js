import { auth } from '@/app/_lib/auth'
import { NextResponse } from 'next/server'

const CHECKOUT_COOKIE = 'checkout_pending_at'
const CHECKOUT_TIMEOUT_MS = 30_000 // 30s

export default auth((req) => {
    const { pathname } = req.nextUrl
    const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
    const isPaymentRoute = pathname === '/payment'
    const isCheckoutRoute = pathname.startsWith('/checkout')

    // Không có token/session?
    if (isAdminRoute && !req.auth) {
        return NextResponse.redirect(new URL('/login', req.url))
    }
    if (isPaymentRoute && !req.auth) {
        // /payment bắt buộc đăng nhập
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // Lấy role từ token trước, user sau (phòng khi session chưa hydrate)
    const role = req.auth?.token?.role ?? req.auth?.user?.role

    // Chặn admin route nếu không phải admin
    if (isAdminRoute && role !== 'admin') {
        return NextResponse.redirect(new URL('/home', req.url))
    }

    // Redirect từ "/" sang "/home"
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/home', req.url))
    }

    // Redirect từ "/account" sang "/account/profile"
    if (pathname === '/account') {
        return NextResponse.redirect(new URL('/account/profile', req.url))
    }

    // --------- Logic chờ 30s cho /checkout/* nếu CHƯA đăng nhập ----------
    if (isCheckoutRoute && !req.auth) {
        const now = Date.now()
        const startedAtStr = req.cookies.get(CHECKOUT_COOKIE)?.value
        const startedAt = startedAtStr ? Number(startedAtStr) : NaN

        // Chưa có cookie -> set mốc thời gian và cho qua (để trang hiển thị loading)
        if (!startedAtStr || Number.isNaN(startedAt)) {
            const res = NextResponse.next()
            res.cookies.set(CHECKOUT_COOKIE, String(now), {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: Math.ceil(CHECKOUT_TIMEOUT_MS / 1000) + 5, // buffer nhỏ
            })
            return res
        }

        // Đã có cookie -> nếu quá 30s mà vẫn chưa đăng nhập => out về /home
        if (now - startedAt > CHECKOUT_TIMEOUT_MS) {
            const res = NextResponse.redirect(new URL('/home', req.url))
            // Xóa cookie đếm thời gian
            res.cookies.delete(CHECKOUT_COOKIE, { path: '/' })
            return res
        }

        // Chưa quá 30s -> tiếp tục cho qua
        return NextResponse.next()
    }

    // Nếu đã đăng nhập và còn cookie đếm thời gian thì xóa đi cho sạch
    if (req.auth && req.cookies.get(CHECKOUT_COOKIE)) {
        const res = NextResponse.next()
        res.cookies.delete(CHECKOUT_COOKIE, { path: '/' })
        return res
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        '/',
        '/admin/:path*',
        '/api/admin/:path*',
        '/account',
        '/payment',
        '/checkout/:path*',
    ],
}

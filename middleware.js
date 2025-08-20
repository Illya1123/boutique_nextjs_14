import { NextResponse } from 'next/server'

export function middleware(req) {
    const { pathname } = req.nextUrl

    // Redirect "/" sang "/home"
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/home', req.url))
    }

    if (pathname === '/admin') {
        // Nếu chưa login / không phải admin, redirect về login hoặc /home
        return NextResponse.next()
    }

    return NextResponse.next()
}

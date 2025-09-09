import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'
import { auth } from '@/app/_lib/auth'

// Lấy profile hiện tại
export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }
        const acc = await prisma.account.findUnique({
            where: { email: session.user.email },
            select: { id: true, name: true, email: true, phone: true, avatar: true, role: true },
        })
        return NextResponse.json({ account: acc }, { status: 200 })
    } catch (err) {
        console.error('Profile GET error:', err)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}

// Cập nhật tên / phone (có thể mở rộng avatar sau)
export async function PATCH(req) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { name, phone } = await req.json()

        const updated = await prisma.account.update({
            where: { email: session.user.email },
            data: {
                name: typeof name === 'string' ? name : undefined,
                phone: typeof phone === 'string' ? phone : undefined,
            },
            select: { id: true, name: true, email: true, phone: true, avatar: true, role: true },
        })

        return NextResponse.json({ account: updated, message: 'Updated' }, { status: 200 })
    } catch (err) {
        console.error('Profile PATCH error:', err)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}

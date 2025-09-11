import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'

// GET: list
export async function GET() {
    try {
        const items = await prisma.paymentMethod.findMany({
            orderBy: { id: 'asc' },
            select: { id: true, name: true, description: true, is_active: true },
        })
        return NextResponse.json({ items })
    } catch (e) {
        console.error('GET /payment-methods', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PATCH: toggle { id: number, is_active: boolean }
export async function PATCH(req) {
    try {
        const { id, is_active } = await req.json()
        if (!Number.isInteger(id)) {
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        }
        if (typeof is_active !== 'boolean') {
            return NextResponse.json({ error: 'Invalid is_active' }, { status: 400 })
        }

        const updated = await prisma.paymentMethod.update({
            where: { id },
            data: { is_active },
            select: { id: true, name: true, description: true, is_active: true },
        })
        return NextResponse.json({ ok: true, item: updated })
    } catch (e) {
        console.error('PATCH /payment-methods', e)
        if (e?.code === 'P2025') {
            return NextResponse.json({ error: 'Payment method not found' }, { status: 404 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

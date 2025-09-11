import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'
import { OrderStatus } from '@prisma/client'

// GET /api/admin/orders?q=&status=&page=1&pageSize=10
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const q = (searchParams.get('q') || '').trim()
        const status = (searchParams.get('status') || '').trim()
        const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
        const pageSize = Math.min(
            Math.max(parseInt(searchParams.get('pageSize') || '10', 10), 1),
            100
        )
        const skip = (page - 1) * pageSize
        const take = pageSize

        const where = {
            AND: [
                status && Object.values(OrderStatus).includes(status) ? { status } : {},
                q
                    ? {
                          OR: [
                              { id: { contains: q, mode: 'insensitive' } },
                              { address: { contains: q, mode: 'insensitive' } },
                              { contact_phone: { contains: q, mode: 'insensitive' } },
                              { customer: { name: { contains: q, mode: 'insensitive' } } },
                              { customer: { email: { contains: q, mode: 'insensitive' } } },
                              { customer: { phone: { contains: q, mode: 'insensitive' } } },
                          ],
                      }
                    : {},
            ],
        }

        const [total, items] = await Promise.all([
            prisma.order.count({ where }),
            prisma.order.findMany({
                where,
                skip,
                take,
                orderBy: { date: 'desc' },
                include: {
                    customer: { select: { id: true, name: true, email: true, phone: true } },
                    paymentMethod: { select: { id: true, name: true } },
                    orderItems: {
                        select: {
                            id: true,
                            quantity: true,
                            price: true,
                            size: true,
                            product: { select: { id: true, name: true } },
                        },
                    },
                },
            }),
        ])

        return NextResponse.json({ page, pageSize, total, items })
    } catch (err) {
        console.error('GET /api/admin/orders error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PATCH /api/admin/orders  body: { id: string, status: OrderStatus }
export async function PATCH(req) {
    try {
        const body = await req.json()
        const { id, status } = body || {}

        if (!id) {
            return NextResponse.json({ error: 'Missing order id' }, { status: 400 })
        }
        if (!status || !Object.values(OrderStatus).includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        const updated = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                customer: { select: { id: true, name: true } },
                paymentMethod: { select: { id: true, name: true } },
            },
        })

        return NextResponse.json({ ok: true, item: updated })
    } catch (err) {
        console.error('PATCH /api/admin/orders error:', err)
        // Nếu record không tồn tại
        if (err?.code === 'P2025') {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

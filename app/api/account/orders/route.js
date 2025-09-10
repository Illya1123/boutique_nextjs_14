// app/api/account/orders/route.js
import { NextResponse } from 'next/server'
import { auth } from '@/app/_lib/auth'
import prisma from '@/app/_lib/prisma'

const toNumber = (x) => (x == null ? 0 : typeof x === 'number' ? x : Number(x))

export async function GET(req) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const page = Math.max(1, Number(searchParams.get('page') || 1))
        const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') || 10)))
        const q = (searchParams.get('q') || '').trim()
        const status = (searchParams.get('status') || '').trim()

        // Lấy user hiện tại
        const account = await prisma.account.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        })
        if (!account) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // where filter
        const where = {
            customer_id: account.id,
            ...(status ? { status } : {}),
            ...(q
                ? {
                      OR: [
                          { id: { contains: q, mode: 'insensitive' } },
                          { address: { contains: q, mode: 'insensitive' } },
                          { contact_phone: { contains: q, mode: 'insensitive' } },
                          // tìm theo tên sản phẩm trong orderItems
                          {
                              orderItems: {
                                  some: {
                                      product: {
                                          name: { contains: q, mode: 'insensitive' },
                                      },
                                  },
                              },
                          },
                      ],
                  }
                : {}),
        }

        const [totalCount, orders] = await Promise.all([
            prisma.order.count({ where }),
            prisma.order.findMany({
                where,
                include: {
                    orderItems: {
                        select: {
                            id: true,
                            quantity: true,
                            price: true,
                            size: true,
                            product: { select: { name: true } },
                        },
                    },
                    paymentMethod: { select: { name: true } },
                },
                orderBy: { date: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ])

        const data = orders.map((o) => ({
            id: o.id,
            date: o.date,
            status: o.status,
            address: o.address,
            contact_phone: o.contact_phone,
            paymentMethod: o.paymentMethod?.name ?? null,
            itemCount: o.orderItems.reduce((acc, it) => acc + it.quantity, 0),
            total: o.orderItems.reduce((sum, it) => sum + toNumber(it.price) * it.quantity, 0),
            items: o.orderItems.map((it) => ({
                id: it.id,
                productName: it.product.name,
                size: it.size,
                quantity: it.quantity,
                price: toNumber(it.price),
            })),
        }))

        return NextResponse.json(
            {
                page,
                pageSize,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
                orders: data,
            },
            { headers: { 'Cache-Control': 'no-store' } }
        )
    } catch (e) {
        // Ghi log chi tiết để debug
        console.error('GET /api/account/orders error:', e)
        return NextResponse.json(
            { error: 'Internal Server Error', detail: String(e?.message ?? e) },
            { status: 500 }
        )
    }
}

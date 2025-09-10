import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req) {
    try {
        const body = await req.json()
        const sp = body?.searchParams || {}
        const lastOrderId = body?.lastOrderId || ''

        const statusFromGateway = String(sp.status || sp.code || '').toUpperCase() // 'PAID', 'CANCELLED',...
        const orderCode = String(sp.orderCode || sp.order_code || '')

        if (!lastOrderId) {
            return NextResponse.json(
                { ok: false, message: 'Thiếu lastOrderId để đối chiếu.' },
                { status: 200 }
            )
        }

        const order = await prisma.order.findUnique({
            where: { id: lastOrderId },
            include: { orderItems: true },
        })

        if (!order) {
            return NextResponse.json({
                ok: false,
                message: 'Không tìm thấy đơn nội bộ.',
                orderCode,
                gatewayStatus: statusFromGateway,
            })
        }

        const paidAmount = order.orderItems.reduce(
            (s, it) => s + Number(it.price) * Number(it.quantity),
            0
        )

        // --- QUICK PATCH ---
        if (statusFromGateway === 'PAID') {
            if (order.status !== 'CONFIRMED') {
                await prisma.order.update({
                    where: { id: order.id },
                    data: { status: 'CONFIRMED' }, // enum OrderStatus
                })
            }
            return NextResponse.json({
                ok: true,
                orderId: order.id,
                orderCode,
                paidAmount,
                message: 'Đã xác nhận thanh toán và cập nhật trạng thái CONFIRMED.',
            })
        }

        if (statusFromGateway === 'CANCELLED') {
            if (order.status !== 'CANCELLED') {
                await prisma.order.update({
                    where: { id: order.id },
                    data: { status: 'CANCELLED' },
                })
            }
            return NextResponse.json({
                ok: false,
                orderId: order.id,
                orderCode,
                paidAmount,
                message: 'Giao dịch đã bị hủy từ cổng thanh toán.',
            })
        }

        // DB đã CONFIRMED sẵn (do webhook) thì vẫn báo ok
        if (order.status === 'CONFIRMED') {
            return NextResponse.json({
                ok: true,
                orderId: order.id,
                orderCode,
                paidAmount,
                message: 'Đơn đã được xác nhận thanh toán trên hệ thống.',
            })
        }

        return NextResponse.json({
            ok: false,
            orderId: order.id,
            orderCode,
            paidAmount,
            message: `Không thể xác minh với trạng thái: ${statusFromGateway || 'UNKNOWN'}`,
        })
    } catch (e) {
        return NextResponse.json(
            { ok: false, error: e?.message || 'HANDLE_RETURN_ERROR' },
            { status: 500 }
        )
    }
}

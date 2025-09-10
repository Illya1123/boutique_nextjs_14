// app/api/payments/payos/webhook/route.js  (App Router)
// Nếu bạn dùng route khác thì đặt đúng đường dẫn webhook PayOS đã cấu hình

import { NextResponse } from 'next/server'
import { PayOS } from '@payos/node'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const payos = new PayOS({
    clientId: process.env.PAYOS_CLIENT_ID,
    apiKey: process.env.PAYOS_API_KEY,
    checksumKey: process.env.PAYOS_CHECKSUM_KEY,
})

export async function POST(req) {
    try {
        const payload = await req.json()

        // 1) Verify chữ ký từ PayOS
        const verified = payos.webhooks.verify(payload)
        if (!verified) {
            return NextResponse.json({ ok: false, error: 'INVALID_SIGNATURE' }, { status: 400 })
        }

        // 2) Trích thông tin cần thiết
        const data = payload?.data || {}
        const orderCode = String(data?.orderCode || data?.order_code || '')
        const statusFromGateway = String(data?.status || '').toUpperCase() // 'PAID' | 'CANCELLED' | ...

        if (!orderCode) {
            return NextResponse.json({ ok: false, error: 'MISSING_ORDER_CODE' }, { status: 400 })
        }

        // 3) Tìm đơn nội bộ theo map payos_order_code
        const order = await prisma.order.findFirst({
            where: { payos_order_code: orderCode },
            select: { id: true, status: true },
        })

        if (!order) {
            // Không tìm thấy — có thể bạn chưa lưu payos_order_code khi tạo link
            // Bạn có thể log lại để truy vết
            console.warn('Webhook PayOS: không tìm thấy order bằng orderCode', orderCode)
            return NextResponse.json({ ok: false, error: 'ORDER_NOT_FOUND' }, { status: 200 })
        }

        // 4) Map trạng thái từ PayOS -> trạng thái nội bộ
        let newStatus = null
        if (statusFromGateway === 'PAID') {
            newStatus = 'CONFIRMED'
        } else if (statusFromGateway === 'CANCELLED') {
            newStatus = 'CANCELLED'
        } else {
            // Các trạng thái khác (PENDING/EXPIRED/…): có thể bỏ qua hoặc map thêm
            return NextResponse.json({
                ok: true,
                skipped: true,
                reason: `UNMAPPED_STATUS:${statusFromGateway}`,
            })
        }

        // Idempotent: chỉ update khi có thay đổi
        if (order.status !== newStatus) {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: newStatus,
                    // Gợi ý thêm: lưu dấu vết cổng thanh toán
                    paymentProvider: 'PAYOS',
                    payos_webhook_last_status: statusFromGateway,
                    payos_webhook_payload: payload, // nếu cột là JSONB
                    // paymentAt: new Date(), // nếu muốn đánh dấu thời điểm thanh toán (chỉ set khi PAID)
                },
            })
        }

        return NextResponse.json({ ok: true, orderId: order.id, status: newStatus })
    } catch (e) {
        console.error('PayOS webhook error:', e)
        return NextResponse.json(
            { ok: false, error: e?.message || 'WEBHOOK_ERROR' },
            { status: 500 }
        )
    }
}

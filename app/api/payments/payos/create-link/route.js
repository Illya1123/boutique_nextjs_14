import { NextResponse } from 'next/server'
import { PayOS } from '@payos/node'

const payos = new PayOS({
    clientId: process.env.PAYOS_CLIENT_ID,
    apiKey: process.env.PAYOS_API_KEY,
    checksumKey: process.env.PAYOS_CHECKSUM_KEY,
})

export async function POST(req) {
    try {
        const body = await req.json() // { orderId, amount, description?, buyer? }

        // orderCode phải là SỐ NGUYÊN theo yêu cầu PayOS
        const orderCode = Number(String(Date.now()).slice(-9)) // ví dụ đơn giản

        const requestData = {
            orderCode,
            amount: Math.round(body.amount),
            description: body.description || `Thanh toan don ${body.orderId}`,
            returnUrl: process.env.PAYOS_RETURN_URL,
            cancelUrl: process.env.PAYOS_CANCEL_URL,
            buyerName: body?.buyer?.name,
            buyerEmail: body?.buyer?.email,
            buyerPhone: body?.buyer?.phone,
        }

        const paymentLink = await payos.paymentRequests.create(requestData)

        return NextResponse.json({
            ok: true,
            data: {
                orderCode,
                checkoutUrl: paymentLink?.checkoutUrl || paymentLink?.shortLink,
                paymentLinkId: paymentLink?.paymentLinkId,
            },
        })
    } catch (err) {
        console.error('PAYOS error:', err)
        return NextResponse.json(
            { ok: false, error: err?.message || 'PAYOS_FAILED' },
            { status: 500 }
        )
    }
}

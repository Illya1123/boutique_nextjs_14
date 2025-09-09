// app/api/orders/route.js
import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'
import { z } from 'zod'
import { OrderStatus } from '@prisma/client'

/** Demo: lấy user từ header. Thay bằng auth thực tế nếu có */
function getUserId(req) {
    const id = req.headers.get('x-user-id')
    return id && id.trim().length > 0 ? id : null
}

const OrderItemInput = z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().min(1),
    price: z.number().positive(),
    size: z.string().trim().min(1),
})

const CreateOrderSchema = z.object({
    id: z.string().uuid(), // <-- client đưa vào
    paymentMethodId: z.number().int(),
    address: z.string().max(255).optional().nullable(),
    contact_phone: z.string().max(15).optional().nullable(),
    items: z.array(OrderItemInput).min(1, 'Cần ít nhất 1 sản phẩm'),
})

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItemInput:
 *       type: object
 *       properties:
 *         product_id: { type: string, format: uuid }
 *         quantity:   { type: integer, minimum: 1, example: 2 }
 *         price:      { type: number, format: float, example: 199000 }
 *         size:       { type: string, example: "M" }
 *       required: [product_id, quantity, price, size]
 *
 *     CreateOrderRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID đơn hàng do client sinh (vd crypto.randomUUID())
 *         paymentMethodId:
 *           type: integer
 *           example: 1
 *         address:
 *           type: string
 *           example: "12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM"
 *         contact_phone:
 *           type: string
 *           example: "+84901234567"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *       required: [id, paymentMethodId, items]
 *
 *     OrderResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         order:
 *           type: object
 *           description: Đơn hàng vừa tạo
 *
 * /orders:
 *   post:
 *     summary: Tạo đơn hàng mới (id do client cung cấp)
 *     tags: [Orders]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: ID người dùng (demo). Thay bằng cơ chế auth thực tế.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201: { description: Tạo thành công }
 *       400: { description: Dữ liệu không hợp lệ }
 *       401: { description: Chưa đăng nhập }
 *       409: { description: ID đơn hàng đã tồn tại }
 *       500: { description: Lỗi server }
 */
export async function POST(req) {
    try {
        const userId = getUserId(req)
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const body = await req.json()
        const parsed = CreateOrderSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const { id, paymentMethodId, address, contact_phone, items } = parsed.data

        // ID đã tồn tại?
        const existed = await prisma.order.findUnique({ where: { id } })
        if (existed) {
            return NextResponse.json(
                { success: false, error: 'Order ID đã tồn tại' },
                { status: 409 }
            )
        }

        // Kiểm tra sản phẩm tồn tại
        const productIds = [...new Set(items.map((i) => i.product_id))]
        const existedProducts = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true },
        })
        const existedSet = new Set(existedProducts.map((p) => p.id))
        const invalid = productIds.filter((pid) => !existedSet.has(pid))
        if (invalid.length) {
            return NextResponse.json(
                { success: false, error: 'Sản phẩm không hợp lệ', invalid },
                { status: 400 }
            )
        }

        // (Tuỳ chọn) Kiểm tra payment method đang active
        const pm = await prisma.paymentMethod.findFirst({
            where: { id: paymentMethodId, is_active: true },
        })
        if (!pm) {
            return NextResponse.json(
                { success: false, error: 'Phương thức thanh toán không hợp lệ / đã tắt' },
                { status: 400 }
            )
        }

        // Tạo đơn hàng với ID do client cung cấp
        const order = await prisma.order.create({
            data: {
                id, // <-- dùng id từ client
                customer_id: userId,
                status: OrderStatus.PENDING,
                payment_method_id: paymentMethodId,
                address: address ?? null,
                contact_phone: contact_phone ?? null,
                orderItems: {
                    create: items.map((i) => ({
                        product_id: i.product_id,
                        quantity: i.quantity,
                        price: i.price,
                        size: i.size,
                    })),
                },
            },
            include: { orderItems: true, paymentMethod: true },
        })

        return NextResponse.json({ success: true, order }, { status: 201 })
    } catch (err) {
        console.error('POST /orders error:', err)
        return NextResponse.json(
            { success: false, error: 'Lỗi server khi tạo đơn hàng' },
            { status: 500 }
        )
    }
}

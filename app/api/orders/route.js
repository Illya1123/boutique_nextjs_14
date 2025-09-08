// app/api/orders/route.js
import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'
import { z } from 'zod'
import { OrderStatus } from '@prisma/client'

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItemInput:
 *       type: object
 *       properties:
 *         product_id:
 *           type: string
 *           format: uuid
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         price:
 *           type: number
 *           format: float
 *           example: 199000
 *         size:
 *           type: string
 *           example: "M"
 *       required: [product_id, quantity, price, size]
 *
 *     CreateOrderRequest:
 *       type: object
 *       properties:
 *         paymentMethodId:
 *           type: integer
 *           example: 1
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *       required: [paymentMethodId, items]
 *
 *     OrderResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         order:
 *           type: object
 *           description: Đơn hàng vừa tạo
 */

/** Demo: lấy user từ header. Thay bằng auth thực tế nếu có */
function getUserId(req) {
    const id = req.headers.get('x-user-id')
    return id && id.trim().length > 0 ? id : null
}

const CreateOrderSchema = z.object({
    paymentMethodId: z.number().int(),
    items: z
        .array(
            z.object({
                product_id: z.string().uuid(),
                quantity: z.number().int().min(1),
                price: z.number().positive(),
                size: z.string().trim().min(1),
            })
        )
        .min(1, 'Cần ít nhất 1 sản phẩm'),
})

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID người dùng (demo). Thay bằng cơ chế auth thực tế.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       200:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi server
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

        const { paymentMethodId, items } = parsed.data

        // Kiểm tra sản phẩm tồn tại
        const productIds = [...new Set(items.map((i) => i.product_id))]
        const existing = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true },
        })
        const existingSet = new Set(existing.map((p) => p.id))
        const invalid = productIds.filter((id) => !existingSet.has(id))
        if (invalid.length) {
            return NextResponse.json(
                { success: false, error: 'Sản phẩm không hợp lệ', invalid },
                { status: 400 }
            )
        }

        // Tạo đơn hàng
        const order = await prisma.order.create({
            data: {
                customer_id: userId,
                status: OrderStatus.PENDING,
                payment_method_id: paymentMethodId,
                orderItems: {
                    create: items.map((i) => ({
                        product_id: i.product_id,
                        quantity: i.quantity,
                        price: i.price,
                        size: i.size,
                    })),
                },
            },
            include: { orderItems: true },
        })

        return NextResponse.json({ success: true, order })
    } catch (err) {
        console.error('POST order error:', err)
        return NextResponse.json(
            { success: false, error: 'Lỗi server khi tạo đơn hàng' },
            { status: 500 }
        )
    }
}

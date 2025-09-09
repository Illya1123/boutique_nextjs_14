import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * @swagger
 * /api/payment-methods:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Lấy danh sách phương thức thanh toán đang hoạt động
 *     description: Trả về toàn bộ các phương thức thanh toán có `is_active = true`.
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 methods:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PaymentMethod'
 *             example:
 *               methods:
 *                 - id: 1
 *                   name: "Credit Card"
 *                   description: "Thanh toán qua thẻ tín dụng"
 *                   is_active: true
 *                 - id: 2
 *                   name: "COD"
 *                   description: "Thanh toán khi nhận hàng"
 *                   is_active: true
 *       500:
 *         description: Lỗi server
 *
 * components:
 *   schemas:
 *     PaymentMethod:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Credit Card"
 *         description:
 *           type: string
 *           example: "Thanh toán qua thẻ tín dụng"
 *         is_active:
 *           type: boolean
 *           example: true
 */
export async function GET() {
    try {
        const methods = await prisma.paymentMethod.findMany({
            where: { is_active: true },
            orderBy: { id: 'asc' },
        })
        return NextResponse.json({ methods })
    } catch (err) {
        console.error('Get payment methods error:', err)
        return NextResponse.json({ message: 'Lỗi server' }, { status: 500 })
    }
}

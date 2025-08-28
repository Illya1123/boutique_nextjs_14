import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lấy danh sách sản phẩm hoặc 1 sản phẩm theo id
 *     description: >
 *       - Nếu có query param `id` → trả về chi tiết 1 sản phẩm  
 *       - Nếu không có → trả về danh sách tất cả sản phẩm
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: ID sản phẩm cần lấy
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi server
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "prod_123"
 *         name:
 *           type: string
 *           example: "Áo thun nam"
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "cat_1"
 *             name:
 *               type: string
 *               example: "Thời trang"
 *         variants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "var_1"
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                       example: "M"
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (id) {
            // Lấy 1 sản phẩm theo id
            const product = await prisma.product.findUnique({
                where: { id: id },
                include: {
                    variants: {
                        include: {
                            sizes: true,
                            images: true,
                        },
                    },
                    category: true,
                },
            })
            if (!product) {
                return NextResponse.json(
                    { success: false, error: 'Product not found' },
                    { status: 404 }
                )
            }
            return NextResponse.json({ success: true, product })
        } else {
            // Lấy tất cả sản phẩm
            const products = await prisma.product.findMany({
                include: {
                    variants: {
                        include: {
                            sizes: true,
                            images: true,
                        },
                    },
                    category: true,
                },
            })
            return NextResponse.json({ success: true, products })
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

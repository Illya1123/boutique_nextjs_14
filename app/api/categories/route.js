import prisma from '@/app/_lib/prisma'
import { NextResponse } from 'next/server'

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Áo thun"
 *     CategoryWithProducts:
 *       allOf:
 *         - $ref: '#/components/schemas/Category'
 *         - type: object
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy tất cả category hoặc 1 category theo id
 *     tags: [Categories - User]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID category cần lấy
 *       - in: query
 *         name: withProducts
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Nếu true → trả về kèm danh sách sản phẩm
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Category'
 *                 - $ref: '#/components/schemas/CategoryWithProducts'
 *       404:
 *         description: Không tìm thấy category
 */

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        const withProducts = searchParams.get('withProducts') === 'true'

        if (id) {
            // Nếu có id → lấy 1 category
            const category = await prisma.category.findUnique({
                where: { id: Number(id) },
                include: withProducts ? { products: true } : undefined,
            })

            if (!category) {
                return NextResponse.json({ error: 'Category not found' }, { status: 404 })
            }

            return NextResponse.json(category)
        }

        // Nếu không có id → lấy tất cả
        if (withProducts) {
            // Lấy kèm products
            const categories = await prisma.category.findMany({
                include: { products: true },
            })
            return NextResponse.json(categories)
        } else {
            // Chỉ lấy id + name
            const categories = await prisma.category.findMany({
                select: { id: true, name: true },
            })
            return NextResponse.json(categories)
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}

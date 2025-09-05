import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'

/**
 * @swagger
 * /admin/blogCategories:
 *   post:
 *     summary: Tạo danh mục blog mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tin tức"
 *               description:
 *                 type: string
 *                 example: "Các bài viết tin tức"
 *     responses:
 *       200:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCategory'
 *       400:
 *         description: Thiếu dữ liệu đầu vào
 *       500:
 *         description: Lỗi server
 *
 *   put:
 *     summary: Cập nhật danh mục blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *               name:
 *                 type: string
 *                 example: "Tin công nghệ"
 *               description:
 *                 type: string
 *                 example: "Các bài viết liên quan đến công nghệ"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCategory'
 *       400:
 *         description: Thiếu ID hoặc trường cập nhật
 *       500:
 *         description: Lỗi server
 *
 *   delete:
 *     summary: Xoá danh mục blog
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của danh mục cần xoá
 *     responses:
 *       200:
 *         description: Xoá thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Deleted category id=3"
 *       400:
 *         description: Thiếu ID
 *       500:
 *         description: Lỗi server
 *
 * components:
 *   schemas:
 *     BlogCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         name:
 *           type: string
 *           example: "Tin tức"
 *         description:
 *           type: string
 *           example: "Các bài viết tin tức"
 */

export async function POST(req) {
    try {
        const body = await req.json()
        const { name, description } = body

        if (!name || !description) {
            return NextResponse.json(
                { success: false, error: 'Missing name or description' },
                { status: 400 }
            )
        }

        const newCategory = await prisma.blogCategory.create({
            data: { name, description },
        })

        return NextResponse.json({ success: true, category: newCategory })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function PUT(req) {
    try {
        const body = await req.json()
        const { id, name, description } = body

        if (!id || (!name && !description)) {
            return NextResponse.json(
                { success: false, error: 'Missing id or update fields' },
                { status: 400 }
            )
        }

        const updatedCategory = await prisma.blogCategory.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description && { description }),
            },
        })

        return NextResponse.json({ success: true, category: updatedCategory })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url)
        const id = parseInt(searchParams.get('id'))

        if (!id) {
            return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
        }

        await prisma.blogCategory.delete({
            where: { id },
        })

        return NextResponse.json({ success: true, message: `Deleted category id=${id}` })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

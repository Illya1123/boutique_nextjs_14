import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags: [Categories - Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Danh mục được tạo thành công
 *       500:
 *         description: Lỗi server
 */
export async function POST(req) {
    try {
        const body = await req.json()

        const category = await prisma.category.create({
            data: {
                name: body.name,
            },
        })

        return NextResponse.json({ success: true, category})
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message}, {status: 500})
    }
}


/**
 * @swagger
 * /admin/categories:
 *   put:
 *     summary: Cập nhật danh mục theo ID
 *     tags: [Categories - Admin]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Thiếu ID
 *       500:
 *         description: Lỗi server
 */
export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if(!id) {
            return NextResponse.json(
                {success: false, error: 'Category id is required'},
                {status: 400}
            )
        }

        const body = await req.json()

        const category = await prisma.category.update({
            where: { id: Number(id) },
            data: {
                name: body.name
            },
        })
        return NextResponse.json({success: true, category})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, error:error.message}, {status: 500})
    }
}

/**
 * @swagger
 * /admin/categories:
 *   delete:
 *     summary: Xóa danh mục theo ID
 *     tags: [Categories - Admin]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *         description: Thiếu ID
 *       500:
 *         description: Lỗi server
 */
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Category id is required' },
                { status: 400 }
            )
        }

        await prisma.category.delete({
            where: { id: Number(id) },
        })

        return NextResponse.json({ success: true, message: 'Category deleted' })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'

/**
 * @swagger
 * /admin/blogs:
 *   post:
 *     summary: Tạo blog mới
 *     tags: [Blogs - Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               author_id:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               paragraphs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     text:
 *                       type: string
 *                     image_url:
 *                       type: string
 *                     order:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Blog được tạo thành công
 *       500:
 *         description: Lỗi server
 */
export async function POST(req) {
    try {
        const body = await req.json()
        const { title, category_id, author_id, tags = [], paragraphs = [] } = body

        // B1: Tạo blog trước, KHÔNG truyền tags vào đây
        const blog = await prisma.blog.create({
            data: {
                title,
                category_id,
                author_id,
                paragraph: {
                    create: paragraphs.map((p, index) => ({
                        type: p.type,
                        image_url: p.image_url || null,
                        text: p.text,
                        order: p.order ?? index,
                    })),
                },
            },
        })

        // B2: Tạo từng tag trong bảng BlogTag
        for (const tagName of tags) {
            const tag = await prisma.tag.upsert({
                where: { name: tagName },
                update: {},
                create: { name: tagName },
            })

            await prisma.blogTag.create({
                data: {
                    blog_id: blog.id,
                    tag_id: tag.id,
                },
            })
        }

        // B3: Trả lại dữ liệu blog đã có tags & paragraphs
        const fullBlog = await prisma.blog.findUnique({
            where: { id: blog.id },
            include: {
                paragraph: true,
                category: true,
                author: true,
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        })

        return NextResponse.json({ success: true, blog: fullBlog })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

/**
 * @swagger
 * /admin/blogs:
 *   put:
 *     summary: Cập nhật blog theo ID
 *     tags: [Blogs - Admin]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               paragraphs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     text:
 *                       type: string
 *                     image_url:
 *                       type: string
 *                     order:
 *                       type: integer
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

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Blog id is required' },
                { status: 400 }
            )
        }

        const body = await req.json()
        const { title, category_id, tags = [], paragraphs = [] } = body

        // Xoá các tag cũ
        await prisma.blogTag.deleteMany({ where: { blog_id: id } })

        const blog = await prisma.blog.update({
            where: { id },
            data: {
                title,
                category_id,
                paragraph: {
                    deleteMany: {}, // Xoá toàn bộ đoạn cũ
                    create: paragraphs.map((p, index) => ({
                        type: p.type,
                        image_url: p.image_url || null,
                        text: p.text,
                        order: p.order ?? index,
                    })),
                },
                tags: {
                    create: tags.map((tagName) => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tagName },
                                create: { name: tagName },
                            },
                        },
                    })),
                },
            },
            include: {
                paragraph: true,
                category: true,
                tags: {
                    include: { tag: true },
                },
            },
        })

        return NextResponse.json({ success: true, blog })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

/**
 * @swagger
 * /admin/blogs:
 *   delete:
 *     summary: Xoá blog theo ID
 *     tags: [Blogs - Admin]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xoá thành công
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
                { success: false, error: 'Blog id is required' },
                { status: 400 }
            )
        }

        // Xoá comments liên quan
        await prisma.blogComment.deleteMany({ where: { blog_id: id } })

        // Xoá paragraphs liên quan
        await prisma.paragraph.deleteMany({ where: { blog_id: id } })

        // Xoá blog
        await prisma.blog.delete({ where: { id } })

        return NextResponse.json({ success: true, message: 'Blog deleted' })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

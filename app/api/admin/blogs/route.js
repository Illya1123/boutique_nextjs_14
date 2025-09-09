import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'
import { auth } from '@/app/_lib/auth'

/**
 * @swagger
 * /admin/blogs:
 *   post:
 *     summary: Tạo blog mới
 *     tags: [Blogs - Admin]
 *     description: Yêu cầu quyền admin. author_id được lấy từ session, không nhận từ body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, category_id, paragraphs]
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
 *                       enum: [text, image]
 *                     text:
 *                       type: string
 *                     image_url:
 *                       type: string
 *                     order:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Blog được tạo thành công
 *       400:
 *         description: Thiếu dữ liệu
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi server
 */
export async function POST(req) {
    try {
        const session = await auth()
        if (!session?.user?.guestId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }
        // Nếu muốn chắc chắn:
        // if (session.user.role !== 'admin') {
        //   return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
        // }

        const { title, category_id, tags = [], paragraphs = [] } = await req.json()

        if (!title || !category_id || !Array.isArray(paragraphs) || paragraphs.length === 0) {
            return NextResponse.json({ success: false, error: 'Thiếu dữ liệu' }, { status: 400 })
        }

        const normalizedParagraphs = paragraphs.map((p, idx) => ({
            type: p.type === 'image' ? 'image' : 'text',
            text: p.text ?? '',
            image_url: p.type === 'image' ? (p.image_url ?? null) : null,
            order: Number.isFinite(p.order) ? p.order : idx + 1,
        }))

        const tagCreates = tags.map((name) => ({
            tag: {
                connectOrCreate: {
                    where: { name },
                    create: { name },
                },
            },
        }))

        // Transaction: tạo blog + paragraphs + tags, sau đó load lại đầy đủ
        const created = await prisma.$transaction(async (tx) => {
            const blog = await tx.blog.create({
                data: {
                    title,
                    category: { connect: { id: Number(category_id) } },
                    author: { connect: { id: session.user.guestId } },
                    paragraph: {
                        createMany: { data: normalizedParagraphs },
                    },
                    tags: { create: tagCreates },
                },
                select: { id: true },
            })

            return tx.blog.findUnique({
                where: { id: blog.id },
                include: {
                    paragraph: true,
                    category: true,
                    author: true,
                    tags: { include: { tag: true } },
                },
            })
        })

        return NextResponse.json({ success: true, blog: created }, { status: 201 })
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
 *                       enum: [text, image]
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
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi server
 */
export async function PUT(req) {
    try {
        const session = await auth()
        if (!session?.user?.guestId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }
        // if (session.user.role !== 'admin') return NextResponse.json({ success:false, error:'Forbidden'},{status:403})

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Blog id is required' },
                { status: 400 }
            )
        }

        const { title, category_id, tags = [], paragraphs = [] } = await req.json()

        const normalizedParagraphs = (paragraphs ?? []).map((p, idx) => ({
            type: p.type === 'image' ? 'image' : 'text',
            text: p.text ?? '',
            image_url: p.type === 'image' ? (p.image_url ?? null) : null,
            order: Number.isFinite(p.order) ? p.order : idx + 1,
        }))

        const result = await prisma.$transaction(async (tx) => {
            // reset tags (join table)
            await tx.blogTag.deleteMany({ where: { blog_id: id } })

            // update blog + replace paragraphs + add tags
            await tx.blog.update({
                where: { id },
                data: {
                    title: title ?? undefined,
                    category_id: category_id ?? undefined,
                    paragraph: {
                        deleteMany: {}, // xóa toàn bộ đoạn cũ
                        createMany: { data: normalizedParagraphs },
                    },
                    tags: {
                        create: (tags ?? []).map((name) => ({
                            tag: {
                                connectOrCreate: {
                                    where: { name },
                                    create: { name },
                                },
                            },
                        })),
                    },
                },
            })

            return tx.blog.findUnique({
                where: { id },
                include: {
                    paragraph: true,
                    category: true,
                    author: true,
                    tags: { include: { tag: true } },
                },
            })
        })

        return NextResponse.json({ success: true, blog: result })
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
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi server
 */
export async function DELETE(req) {
    try {
        const session = await auth()
        if (!session?.user?.guestId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }
        // if (session.user.role !== 'admin') return NextResponse.json({ success:false, error:'Forbidden'},{status:403})

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Blog id is required' },
                { status: 400 }
            )
        }

        await prisma.$transaction(async (tx) => {
            // BlogComment không cascade → cần xóa trước
            await tx.blogComment.deleteMany({ where: { blog_id: id } })
            // Paragraph đang cascade theo schema → không cần xóa thủ công
            // BlogTag có onDelete: Cascade → không cần xóa thủ công
            await tx.blog.delete({ where: { id } })
        })

        return NextResponse.json({ success: true, message: 'Blog deleted' })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

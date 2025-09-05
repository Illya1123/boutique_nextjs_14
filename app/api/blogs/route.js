import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Lấy danh sách blog hoặc 1 blog theo id
 *     description: >
 *       - Nếu có query param `id` → trả về chi tiết 1 blog
 *       - Nếu không có → trả về danh sách tất cả blogs
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: ID blog cần lấy
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
 *                     blog:
 *                       $ref: '#/components/schemas/Blog'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     blogs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Không tìm thấy blog
 *       500:
 *         description: Lỗi server
 *
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "blog_123"
 *         title:
 *           type: string
 *           example: "Cách học Next.js hiệu quả"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *             example: "nextjs"
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: "Lập trình"
 *         author:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "user_123"
 *             name:
 *               type: string
 *               example: "Nguyễn Văn A"
 */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        // helper: bỏ image_url nếu type === 'text'
        const sanitizeParagraphs = (paragraphs) =>
            paragraphs.map((p) => {
                const base = { type: p.type, text: p.text, order: p.order }
                return p.type === 'image' ? { ...base, image_url: p.image_url } : base
            })

        if (id) {
            const blog = await prisma.blog.findUnique({
                where: { id },
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    paragraph: {
                        select: { type: true, image_url: true, text: true, order: true },
                        orderBy: { order: 'asc' },
                    },
                },
            })

            if (!blog) {
                return NextResponse.json(
                    { success: false, error: 'Blog not found' },
                    { status: 404 }
                )
            }

            const blogSanitized = {
                ...blog,
                paragraph: sanitizeParagraphs(blog.paragraph),
            }

            return NextResponse.json({ success: true, blog: blogSanitized })
        } else {
            const blogs = await prisma.blog.findMany({
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    paragraph: {
                        select: { type: true, image_url: true, text: true, order: true },
                        orderBy: { order: 'asc' },
                    },
                },
                orderBy: { createdAt: 'desc' },
            })

            const blogsSanitized = blogs.map((b) => ({
                ...b,
                paragraph: sanitizeParagraphs(b.paragraph),
            }))

            return NextResponse.json({ success: true, blogs: blogsSanitized })
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

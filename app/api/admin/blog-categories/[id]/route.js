import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'

export async function PATCH(req, { params }) {
    try {
        const id = Number(params.id)
        if (!Number.isInteger(id)) {
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        }
        const body = await req.json()
        const data = {}
        if (typeof body.name === 'string') data.name = body.name.trim()
        if (typeof body.description === 'string') data.description = body.description.trim()

        if (!Object.keys(data).length) {
            return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
        }

        const updated = await prisma.blogCategory.update({
            where: { id },
            data,
            select: { id: true, name: true, description: true },
        })

        return NextResponse.json({ ok: true, item: updated })
    } catch (e) {
        console.error('PATCH /blog-categories/[id]', e)
        if (e?.code === 'P2025') {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 })
        }
        if (e?.code === 'P2002') {
            return NextResponse.json({ error: 'Category name already exists' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    try {
        const id = Number(params.id)
        if (!Number.isInteger(id)) {
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        }

        await prisma.blogCategory.delete({ where: { id } })
        return NextResponse.json({ ok: true })
    } catch (e) {
        console.error('DELETE /blog-categories/[id]', e)
        if (e?.code === 'P2025') {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 })
        }
        // Nếu có ràng buộc FK (đang có Blog tham chiếu), Prisma có thể quăng lỗi (ví dụ P2003/Restrict)
        if (e?.code === 'P2003') {
            return NextResponse.json(
                { error: 'Cannot delete: category is in use' },
                { status: 409 }
            )
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

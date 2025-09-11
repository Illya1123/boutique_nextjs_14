import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'

// GET: liệt kê BlogCategory
export async function GET() {
    try {
        const items = await prisma.blogCategory.findMany({
            orderBy: { id: 'asc' },
            select: { id: true, name: true, description: true },
        })
        return NextResponse.json({ items })
    } catch (e) {
        console.error('GET /blog-categories', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST: tạo BlogCategory { name, description }
export async function POST(req) {
    try {
        const { name, description } = await req.json()
        if (!name?.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }
        const created = await prisma.blogCategory.create({
            data: { name: name.trim(), description: (description || '').trim() },
            select: { id: true, name: true, description: true },
        })
        return NextResponse.json({ ok: true, item: created })
    } catch (e) {
        console.error('POST /blog-categories', e)
        // Uniq constraint? (nếu name unique) -> trả 409
        if (e?.code === 'P2002') {
            return NextResponse.json({ error: 'Category name already exists' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

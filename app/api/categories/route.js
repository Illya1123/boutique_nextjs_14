import prisma from '@/app/_lib/prisma'
import { NextResponse } from 'next/server'

// GET: lấy tất cả hoặc 1 category theo id
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

// POST: tạo mới, nếu trùng name thì không tạo
export async function POST(req) {
    try {
        const body = await req.json()
        const { name } = body

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        // Kiểm tra name đã tồn tại chưa
        const existing = await prisma.category.findUnique({
            where: { name },
        })

        if (existing) {
            return NextResponse.json(existing, { status: 200 })
        }

        const category = await prisma.category.create({
            data: { name },
        })

        return NextResponse.json(category, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }
}

// PUT: cập nhật (yêu cầu query param id)
export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID is required for update' }, { status: 400 })
        }

        const body = await req.json()
        const { name } = body

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        const category = await prisma.category.update({
            where: { id: Number(id) },
            data: { name },
        })

        return NextResponse.json(category)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
    }
}

// DELETE: xóa (yêu cầu query param id)
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID is required for delete' }, { status: 400 })
        }

        await prisma.category.delete({
            where: { id: Number(id) },
        })

        return NextResponse.json({ message: 'Category deleted successfully' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
    }
}

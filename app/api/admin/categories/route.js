import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'

// POST - tạo danh mục
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


// PUT - cập nhật danh mục
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

// DELETE - xóa danh mục
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

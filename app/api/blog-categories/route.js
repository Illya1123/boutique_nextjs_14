import { NextResponse } from 'next/server'
import prisma from '@/app/_lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ categories })
  } catch (e) {
    return NextResponse.json({ categories: [] }, { status: 200 })
  }
}

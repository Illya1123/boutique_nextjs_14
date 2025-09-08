import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    const methods = await prisma.paymentMethod.findMany({
        where: { is_active: true },
        orderBy: { id: 'asc' },
    })
    return NextResponse.json({ methods })
}

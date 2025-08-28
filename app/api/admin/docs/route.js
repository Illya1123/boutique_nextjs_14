import { NextResponse } from 'next/server'
import swaggerSpec from '@/app/_lib/swagger'

export async function GET() {
    return NextResponse.json(swaggerSpec)
}

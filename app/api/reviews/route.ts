export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const bookId = req.nextUrl.searchParams.get('bookId')
  if (!bookId) return NextResponse.json({ reviews: [] })
  const reviews = await prisma.review.findMany({
    where: { bookId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ reviews })
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { bookId, bookTitle, stars, text } = await req.json()
  const review = await prisma.review.create({
    data: { userId: user.id, bookId, bookTitle, stars, text },
    include: { user: { select: { name: true } } },
  })
  return NextResponse.json({ review })
}

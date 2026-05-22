export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const lists = await prisma.list.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ lists })
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { bookId, bookTitle, bookAuthor, bookCover, status } = await req.json()

  const list = await prisma.list.upsert({
    where: { userId_bookId: { userId: user.id, bookId } },
    update: { status },
    create: { userId: user.id, bookId, bookTitle, bookAuthor, bookCover, status },
  })
  return NextResponse.json({ list })
}

export async function DELETE(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { bookId } = await req.json()
  await prisma.list.deleteMany({ where: { userId: user.id, bookId } })
  return NextResponse.json({ ok: true })
}

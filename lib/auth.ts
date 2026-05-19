import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const SECRET = process.env.JWT_SECRET || 'dev-secret'

export function signToken(payload: { id: string; email: string; name: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: string; email: string; name: string }
  } catch {
    return null
  }
}

export function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

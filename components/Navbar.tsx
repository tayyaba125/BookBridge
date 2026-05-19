'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const path = usePathname()

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user) }).catch(() => {})
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/?q=${encodeURIComponent(query.trim())}`)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-brand-400 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-gray-900">BookBridge</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 h-9">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-gray-400 shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); onSearch?.(e.target.value) }}
              placeholder="Search books, authors..."
              className="bg-transparent text-sm text-gray-700 w-full border-none"
            />
          </div>
        </form>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <Link href="/" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${path === '/' ? 'bg-brand-50 text-brand-600 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}>
            Home
          </Link>
          <Link href="/lists" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${path === '/lists' ? 'bg-brand-50 text-brand-600 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}>
            My Lists
          </Link>
          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-gray-600">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-50">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-2">
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-50">Login</Link>
              <Link href="/register" className="text-sm bg-brand-400 hover:bg-brand-600 text-white px-3 py-1.5 rounded-lg transition-colors">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

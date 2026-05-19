'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import BookCard from '@/components/BookCard'
import Link from 'next/link'

const TABS = [
  { key: 'want',    label: 'Want to read' },
  { key: 'reading', label: 'Currently reading' },
  { key: 'done',    label: 'Completed' },
]

export default function ListsPage() {
  const [lists, setLists] = useState<Record<string, any[]>>({ want: [], reading: [], done: [] })
  const [tab, setTab] = useState('want')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) {
        setUser(d.user)
        fetch('/api/lists').then(r => r.json()).then(data => {
          const grouped: Record<string, any[]> = { want: [], reading: [], done: [] }
          ;(data.lists || []).forEach((item: any) => { grouped[item.status]?.push(item) })
          setLists(grouped)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })
  }, [])

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-5xl mb-4">📚</p>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your reading lists live here</h2>
          <p className="text-sm text-gray-400 mb-6">Sign in to track books you want to read, are reading, or have finished.</p>
          <Link href="/login" className="bg-brand-400 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">Log in to see your lists</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My reading lists</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit mb-8">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${tab === t.key ? 'bg-brand-50 text-brand-600 font-medium' : 'text-gray-500 hover:text-gray-800'}`}>
              {t.label}
              <span className={`ml-2 text-xs rounded-full px-1.5 py-0.5 ${tab === t.key ? 'bg-brand-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {lists[t.key]?.length || 0}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-gray-100">
                <div className="aspect-[2/3] bg-gray-100" />
                <div className="p-3 space-y-2"><div className="h-3 bg-gray-100 rounded" /><div className="h-2.5 bg-gray-100 rounded w-2/3" /></div>
              </div>
            ))}
          </div>
        ) : lists[tab].length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔖</p>
            <p className="text-sm text-gray-400">No books here yet.</p>
            <Link href="/" className="mt-3 inline-block text-sm text-brand-600 underline">Browse and add some</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {lists[tab].map((item: any) => (
              <BookCard key={item.id} book={{
                key: item.bookId.replace(/_/g, '/'),
                title: item.bookTitle,
                author_name: [item.bookAuthor],
                cover_i: item.bookCover ? parseInt(item.bookCover) : undefined,
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

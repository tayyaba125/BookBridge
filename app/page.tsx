'use client'
import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import BookCard, { Book } from '@/components/BookCard'

const GENRES = [
  { label: 'Fiction',    q: 'popular fiction bestsellers' },
  { label: 'Science',    q: 'science popular books' },
  { label: 'History',    q: 'world history nonfiction' },
  { label: 'Self Help',  q: 'self help productivity' },
  { label: 'Philosophy', q: 'philosophy classics' },
  { label: 'Biography',  q: 'biography memoir' },
  { label: 'Mystery',    q: 'mystery thriller crime' },
  { label: 'Indian',     q: 'indian authors literature' },
]

async function fetchBooks(query: string): Promise<Book[]> {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year,ratings_average`
  )
  const data = await res.json()
  return (data.docs || []).filter((b: Book) => b.cover_i).slice(0, 16)
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGenre, setActiveGenre] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const load = useCallback(async (q: string) => {
    setLoading(true)
    const data = await fetchBooks(q)
    setBooks(data)
    setLoading(false)
  }, [])

  useEffect(() => { load(GENRES[0].q) }, [load])

  useEffect(() => {
    if (!searchQuery) return
    const t = setTimeout(() => load(searchQuery), 600)
    return () => clearTimeout(t)
  }, [searchQuery, load])

  const handleGenre = (i: number) => {
    setActiveGenre(i)
    setSearchQuery('')
    load(GENRES[i].q)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={setSearchQuery} />

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Not all who wander the shelves are lost.
          </h1>
          <p className="text-gray-400 text-sm mb-5">
            Browse millions of books, read community reviews, and buy from Amazon or Flipkart — all without leaving the page.
          </p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g, i) => (
              <button
                key={g.label}
                onClick={() => handleGenre(i)}
                className={`chip ${activeGenre === i && !searchQuery ? 'chip-active' : ''}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[15px] font-semibold text-gray-800">
            {searchQuery ? `Results for "${searchQuery}"` : `Trending in ${GENRES[activeGenre].label}`}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-gray-100">
                <div className="aspect-[2/3] bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded" />
                  <div className="h-2.5 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📚</p>
            <p className="text-sm">No books found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {books.map(book => <BookCard key={book.key} book={book} />)}
          </div>
        )}
      </div>
    </div>
  )
}

import Navbar from '@/components/Navbar'
import BuyPanel from '@/components/BuyPanel'
import ReviewSection from '@/components/ReviewSection'
import { coverUrl } from '@/components/BookCard'
import Link from 'next/link'

async function getBook(id: string) {
  const realKey = id.replace(/_/g, '/')
  const worksKey = realKey.startsWith('/works') ? realKey : '/works/' + realKey.split('/').pop()
  try {
    const [workRes, searchRes] = await Promise.all([
      fetch(`https://openlibrary.org${worksKey}.json`, { next: { revalidate: 3600 } }),
      fetch(`https://openlibrary.org/search.json?q=${worksKey}&fields=key,title,author_name,cover_i,first_publish_year,ratings_average,ratings_count&limit=1`, { next: { revalidate: 3600 } })
    ])
    const work = await workRes.json()
    const search = await searchRes.json()
    const meta = search.docs?.[0] || {}
    return { ...work, ...meta, key: worksKey }
  } catch {
    return null
  }
}

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id)
  if (!book) return <div className="p-8 text-gray-400">Book not found.</div>

  const title = book.title || 'Unknown Title'
  const authors = Array.isArray(book.author_name) ? book.author_name.join(', ') : 'Unknown Author'
  const coverId = book.cover_i
  const rating = book.ratings_average ? parseFloat(book.ratings_average).toFixed(1) : '4.0'
  const rcount = book.ratings_count ? parseInt(book.ratings_count).toLocaleString('en-IN') : '—'
  const desc = book.description
    ? (typeof book.description === 'string' ? book.description : book.description?.value || '')
        .replace(/\r?\n/g, ' ').slice(0, 600)
    : 'No description available for this book.'
  const subjects = (book.subject || []).slice(0, 6)
  const year = book.first_publish_year || ''

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back to browse
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 mb-6">
          {/* Cover */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 bg-brand-50 w-full md:w-[200px] aspect-[2/3] flex items-center justify-center shrink-0">
            {coverId ? (
              <img src={coverUrl(coverId, 'L')} alt={title} className="w-full h-full object-cover" />
            ) : (
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#5DCAA5" strokeWidth="1.5">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            )}
          </div>

          {/* Meta */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-1">{title}</h1>
            <p className="text-sm text-gray-400 mb-3">by {authors}{year ? ` · ${year}` : ''}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500 text-base">{'★'.repeat(Math.round(parseFloat(rating)))}</span>
              <span className="text-sm font-medium text-gray-700">{rating}</span>
              <span className="text-xs text-gray-400">· {rcount} ratings</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
            {subjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {subjects.map((s: string) => (
                  <span key={s} className="bg-gray-50 border border-gray-100 rounded-full px-3 py-1 text-[11px] text-gray-500">{s}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buy + Reviews */}
        <div className="space-y-4">
          <BuyPanel title={title} author={authors.split(',')[0]} />
          <ReviewSection bookId={params.id} bookTitle={title} />
        </div>
      </div>
    </div>
  )
}

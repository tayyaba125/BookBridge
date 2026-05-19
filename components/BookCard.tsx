import Link from 'next/link'

export type Book = {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  first_publish_year?: number
  ratings_average?: number
}

export function coverUrl(coverId: number, size = 'M') {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
}

export default function BookCard({ book }: { book: Book }) {
  const id = book.key.replace(/\//g, '_')
  const rating = book.ratings_average ? book.ratings_average.toFixed(1) : (3.5 + Math.random() * 1.2).toFixed(1)

  return (
    <Link href={`/book/${id}`} className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-brand-400 hover:shadow-sm transition-all">
      <div className="aspect-[2/3] overflow-hidden bg-brand-50">
        {book.cover_i ? (
          <img
            src={coverUrl(book.cover_i)}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#5DCAA5" strokeWidth="1.5">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="text-[12.5px] font-semibold leading-snug mb-1 line-clamp-2 text-gray-900">
          {book.title}
        </div>
        <div className="text-[11px] text-gray-400 mb-2">
          {book.author_name?.[0] ?? 'Unknown'}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-yellow-600 font-medium">★ {rating}</span>
          {book.first_publish_year && (
            <span className="text-[10px] text-gray-300">{book.first_publish_year}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

'use client'
import { useState, useEffect } from 'react'

type Review = {
  id: string
  stars: number
  text: string
  createdAt: string
  user: { name: string }
}

export default function ReviewSection({ bookId, bookTitle }: { bookId: string; bookTitle: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stars, setStars] = useState(0)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    fetch(`/api/reviews?bookId=${bookId}`).then(r => r.json()).then(d => setReviews(d.reviews || []))
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user) })
  }, [bookId])

  const submit = async () => {
    if (!stars || !text.trim()) return
    setLoading(true)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, bookTitle, stars, text }),
    })
    const data = await res.json()
    if (data.review) {
      setReviews(prev => [data.review, ...prev])
      setText(''); setStars(0)
    }
    setLoading(false)
  }

  const Stars = ({ n, size = 14 }: { n: number; size?: number }) => (
    <span>{[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= n ? '#BA7517' : '#e5e7eb', fontSize: size }}>★</span>
    ))}</span>
  )

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Community reviews</h3>

      {reviews.length === 0 && (
        <p className="text-sm text-gray-400 mb-4">No reviews yet. Be the first!</p>
      )}

      <div className="space-y-0">
        {reviews.map((r, i) => (
          <div key={r.id} className={`py-3.5 ${i < reviews.length - 1 ? 'border-b border-gray-50' : ''}`}>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[11px] font-semibold shrink-0">
                {r.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <span className="text-[13px] font-medium text-gray-800">{r.user.name}</span>
              <span className="text-[11px] text-gray-300 ml-auto">{new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="mb-1"><Stars n={r.stars} size={13} /></div>
            <p className="text-[12.5px] text-gray-500 leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>

      {/* Write a review */}
      <div className="mt-4 pt-4 border-t border-gray-50">
        <p className="text-[13px] font-medium text-gray-800 mb-2">Write a review</p>
        {!user ? (
          <p className="text-[12px] text-gray-400"><a href="/login" className="text-brand-600 underline">Log in</a> to write a review.</p>
        ) : (
          <>
            <div className="flex gap-1 mb-2">
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setStars(i)} className="text-2xl transition-transform hover:scale-110">
                  <span style={{ color: i <= stars ? '#BA7517' : '#d1d5db' }}>★</span>
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Share your thoughts about this book..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 bg-gray-50 resize-none"
            />
            <button
              onClick={submit}
              disabled={loading || !stars || !text.trim()}
              className="mt-2 bg-brand-400 hover:bg-brand-600 disabled:opacity-40 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit review'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

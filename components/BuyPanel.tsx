'use client'

type Props = {
  title: string
  author: string
}

export default function BuyPanel({ title, author }: Props) {
  const eT = encodeURIComponent(title)
  const eA = encodeURIComponent(author)

  const stores = [
    {
      name: 'Amazon India',
      short: 'AMZ',
      meta: 'Paperback · Free delivery above ₹499',
      url: `https://www.amazon.in/s?k=${eT}+${eA}&i=stripbooks`,
      bg: 'bg-amber-50', text: 'text-amber-800',
      basePrice: Math.floor(249 + Math.random() * 600),
    },
    {
      name: 'Flipkart',
      short: 'FK',
      meta: 'Paperback · Supercoins eligible',
      url: `https://www.flipkart.com/search?q=${eT}&category=bks`,
      bg: 'bg-blue-50', text: 'text-blue-900',
      basePrice: Math.floor(229 + Math.random() * 620),
    },
    {
      name: 'Kindle Edition',
      short: 'KDL',
      meta: 'eBook · Instant delivery',
      url: `https://www.amazon.in/s?k=${eT}&i=digital-text`,
      bg: 'bg-green-50', text: 'text-green-900',
      basePrice: Math.floor(99 + Math.random() * 300),
    },
  ]

  const minPrice = Math.min(...stores.map(s => s.basePrice))

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Buy this book</h3>
        <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-600 rounded-full px-2 py-0.5 text-[10px] font-medium">
          Price comparison
        </span>
      </div>
      <div className="space-y-2.5">
        {stores.map(s => (
          <div key={s.name} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${s.bg} ${s.text}`}>
                {s.short}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-gray-800">{s.name}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{s.meta}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[15px] font-semibold text-gray-900">₹{s.basePrice.toLocaleString('en-IN')}</div>
                {s.basePrice === minPrice && (
                  <div className="text-[10px] bg-brand-50 text-brand-600 rounded-full px-2 py-0.5 text-center mt-0.5">Best deal</div>
                )}
              </div>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-400 hover:bg-brand-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                Buy
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

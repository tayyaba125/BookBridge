# BookBridge 📚

> Not all who wander the shelves are lost.

A book discovery + community platform where you can explore books, write reviews, manage reading lists, and buy from Amazon India or Flipkart — all without leaving the page.

---

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT (httpOnly cookies)
- **Book Data**: Open Library API (free, no key needed)
- **Deployment**: Vercel + Neon (free tier)

---

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` and fill in your values:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/bookbridge"
JWT_SECRET="any-long-random-string"
```

### 3. Set up the database (Neon — free)
1. Go to https://neon.tech and create a free account
2. Create a new project → copy the connection string
3. Paste it as `DATABASE_URL` in `.env.local`
4. Run:
```bash
npm run db:push
```

### 4. Run locally
```bash
npm run dev
```
Open http://localhost:3000

---

## Deploy to Vercel (free)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/bookbridge.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to https://vercel.com and sign up with GitHub
2. Click **Add New Project** → import your `bookbridge` repo
3. Vercel auto-detects Next.js — click **Deploy**

### Step 3 — Add environment variables on Vercel
1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - `DATABASE_URL` → your Neon connection string
   - `JWT_SECRET` → your secret string
3. Go to **Deployments** → click the latest → **Redeploy**

Your app is now live at `https://bookbridge-xxx.vercel.app` 🎉

---

## Project Structure
```
bookbridge/
├── app/
│   ├── page.tsx              # Homepage with book grid
│   ├── book/[id]/page.tsx    # Book detail + buy links
│   ├── lists/page.tsx        # My reading lists
│   ├── login/page.tsx        # Login
│   ├── register/page.tsx     # Register
│   └── api/
│       ├── auth/             # login, register, me, logout
│       ├── lists/            # reading list CRUD
│       └── reviews/          # reviews CRUD
├── components/
│   ├── Navbar.tsx
│   ├── BookCard.tsx
│   ├── BuyPanel.tsx          # Amazon + Flipkart + Kindle links
│   └── ReviewSection.tsx
├── lib/
│   ├── prisma.ts             # DB client
│   └── auth.ts               # JWT helpers
└── prisma/
    └── schema.prisma         # DB schema
```

---

## Features
- 🔍 Search books by title, author, genre
- 📖 Detailed book pages with descriptions, ratings
- 🛒 Buy links — Amazon India, Flipkart, Kindle with price comparison
- 📚 Reading lists — Want to read / Currently reading / Completed
- ⭐ Community reviews and star ratings
- 🔐 User auth — register, login, JWT sessions

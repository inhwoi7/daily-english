// app/api/word-lookup/route.ts
// Server-side proxy for Free Dictionary API
// Benefits: ISR caching, no CORS issues, one source of truth
import { NextRequest, NextResponse } from 'next/server'
import { lookupWord } from '@/lib/dictionary'

export async function GET(req: NextRequest) {
  const word = req.nextUrl.searchParams.get('word')
  if (!word) return NextResponse.json({ error: 'Missing word' }, { status: 400 })

  const data = await lookupWord(word)
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate' },
  })
}

// app/api/word-save/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// POST  → save word
export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { word, meaning, phonetic, example_en } = body

  const { data, error } = await supabase
    .from('user_words')
    .upsert(
      { user_id: user.id, word, meaning, phonetic, example_en, status: 'new' },
      { onConflict: 'user_id,word' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ word: data })
}

// DELETE → remove word
export async function DELETE(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { word } = await req.json()

  const { error } = await supabase
    .from('user_words')
    .delete()
    .match({ user_id: user.id, word })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// GET → list user's saved words
export async function GET(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ words: [] })

  const status = req.nextUrl.searchParams.get('status')
  let query = supabase
    .from('user_words')
    .select('*')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data } = await query
  return NextResponse.json({ words: data ?? [] })
}

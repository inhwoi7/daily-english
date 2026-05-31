// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'
import { createClient as _createClient } from '@supabase/supabase-js'

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ── Browser client (Client Components) ───────────────────────
export function createClient() {
  return createBrowserClient(URL, ANON)
}

// ── Server client (Server Components, Route Handlers) ─────────
// cookies() 없이 사용 — 인증 없는 public 데이터 읽기용
export function createServerClient() {
  return _createClient(URL, ANON, {
    auth: { persistSession: false },
  })
}

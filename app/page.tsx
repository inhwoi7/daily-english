// app/page.tsx  — Server Component (SSG + ISR)
import { createServerClient } from '@/lib/supabase'
import type { Situation } from '@/types'
import HomeClient from '@/components/learning/HomeClient'

export const revalidate = 600 // ISR: rebuild every 10 min

export default async function HomePage() {
  const supabase = await createServerClient()

  const { data: situations } = await supabase
    .from('situations')
    .select('*')
    .order('sort_order')

  return <HomeClient situations={(situations ?? []) as Situation[]} />
}

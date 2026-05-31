// app/page.tsx
import { createServerClient } from '@/lib/supabase'
import type { Situation } from '@/types'
import HomeClient from '@/components/learning/HomeClient'

export const revalidate = 600

export default async function HomePage() {
  const supabase = createServerClient()

  const { data: situations } = await supabase
    .from('situations')
    .select('*')
    .order('sort_order')

  return <HomeClient situations={(situations ?? []) as Situation[]} />
}

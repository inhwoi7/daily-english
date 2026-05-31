// app/situation/[id]/page.tsx
import { createServerClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { SituationWithContent } from '@/types'
import SituationClient from '@/components/learning/SituationClient'

export const revalidate = 600

export async function generateStaticParams() {
  const supabase = createServerClient()
  const { data } = await supabase.from('situations').select('id')
  return (data ?? []).map((s) => ({ id: s.id }))
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function SituationPage({ params }: Props) {
  const { id } = await params
  const supabase = createServerClient()

  const { data } = await supabase
    .from('situations')
    .select(`*, expressions ( * ), vocabularies ( * )`)
    .eq('id', id)
    .order('sequence', { referencedTable: 'expressions' })
    .single()

  if (!data) notFound()

  return <SituationClient situation={data as SituationWithContent} />
}

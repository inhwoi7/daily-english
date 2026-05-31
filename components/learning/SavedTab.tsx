'use client'
// components/learning/SavedTab.tsx
import { useState, useEffect } from 'react'
import type { UserWord } from '@/types'

export default function SavedTab() {
  const [words, setWords] = useState<UserWord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'new' | 'learning' | 'mastered'>('all')

  useEffect(() => { loadWords() }, [])

  async function loadWords() {
    setLoading(true)
    try {
      const res = await fetch('/api/word-save')
      const data = await res.json()
      setWords(data.words ?? [])
    } catch {}
    setLoading(false)
  }

  async function deleteWord(word: string) {
    await fetch('/api/word-save', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word }),
    })
    setWords(w => w.filter(x => x.word !== word))
  }

  const filtered = filter === 'all' ? words : words.filter(w => w.status === filter)
  const STATUS_LABELS = { new: '신규', learning: '학습중', mastered: '완료' }
  const STATUS_COLORS = { new: ['var(--brand-light)', 'var(--brand-dark)'], learning: ['var(--warn-bg)', 'var(--warn)'], mastered: ['var(--success-bg)', 'var(--success)'] }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 40, display: 'flex', justifyContent: 'center', gap: 4 }}>
      {[0,1,2].map(i => <span key={i} className="dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--brand)', display: 'inline-block', animationDelay: `${i*0.2}s` }} />)}
    </div>
  )

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>저장한 단어 {words.length}개</div>
        <button onClick={loadWords} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 16 }}>
          <i className="ti ti-refresh" />
        </button>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {(['all', 'new', 'learning', 'mastered'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '5px 12px', borderRadius: 20, border: '1px solid',
            borderColor: filter === f ? 'var(--brand)' : 'var(--border)',
            background: filter === f ? 'var(--brand)' : 'var(--surface)',
            color: filter === f ? '#fff' : 'var(--text-2)',
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}>
            {f === 'all' ? '전체' : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-3)' }}>
          <i className="ti ti-bookmark-off" style={{ fontSize: 36, display: 'block', marginBottom: 10 }} />
          저장된 단어가 없어요.<br />
          <span style={{ fontSize: 12 }}>사전에서 단어를 검색하고 저장해보세요!</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(w => {
          const [bg, fg] = STATUS_COLORS[w.status]
          return (
            <div key={w.id} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: '12px 14px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{w.word}</span>
                  <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 20, background: bg, color: fg, fontWeight: 600 }}>
                    {STATUS_LABELS[w.status]}
                  </span>
                </div>
                {w.phonetic && <div className="phonetic" style={{ color: 'var(--brand)', marginBottom: 3 }}>{w.phonetic}</div>}
                {w.meaning && <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{w.meaning}</div>}
              </div>
              <button onClick={() => deleteWord(w.word)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-3)', fontSize: 16, flexShrink: 0, padding: '2px 4px',
              }}>
                <i className="ti ti-trash" />
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}

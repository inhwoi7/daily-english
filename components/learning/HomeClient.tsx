'use client'
// components/learning/HomeClient.tsx
import { useState, useEffect } from 'react'
import type { Situation } from '@/types'
import { FULL_VOCAB as ALL_VOCAB } from '@/lib/dictionary'
import DictionaryTab from './DictionaryTab'
import FlashcardTab from './FlashcardTab'
import SavedTab from './SavedTab'
import TutorTab from './TutorTab'
import Link from 'next/link'

interface Props { situations: Situation[] }

type Tab = 'home' | 'dictionary' | 'flashcard' | 'saved' | 'tutor'

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'home',       icon: 'ti-home',     label: '홈'    },
  { id: 'dictionary', icon: 'ti-search',   label: '사전'  },
  { id: 'flashcard',  icon: 'ti-cards',    label: '단어장' },
  { id: 'saved',      icon: 'ti-bookmark', label: '저장'  },
  { id: 'tutor',      icon: 'ti-robot',    label: 'AI튜터' },
]

export default function HomeClient({ situations }: Props) {
  const [tab, setTab] = useState<Tab>('home')
  const [streak, setStreak] = useState(0)
  const [todayWord] = useState(ALL_VOCAB[new Date().getDate() % ALL_VOCAB.length])

  useEffect(() => {
    const s = parseInt(localStorage.getItem('streak') || '7')
    setStreak(s)
  }, [])

  return (
    <>
      {/* ── Top bar ── */}
      <header style={{
        padding: '14px 18px 10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.4px' }}>
          Daily<span style={{ color: 'var(--brand)' }}>EN</span>
          <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-3)', marginLeft: 6 }}>직장인 영어</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'var(--brand-light)', borderRadius: 20,
          padding: '5px 11px', fontSize: 12, fontWeight: 600, color: 'var(--brand-dark)',
        }}>
          <span className="flicker">🔥</span> {streak}일 연속
        </div>
      </header>

      {/* ── Tab content ── */}
      <div className="scroll-area fade-up" key={tab}>
        {tab === 'home'       && <HomeTab situations={situations} todayWord={todayWord} onTabChange={setTab} />}
        {tab === 'dictionary' && <DictionaryTab />}
        {tab === 'flashcard'  && <FlashcardTab />}
        {tab === 'saved'      && <SavedTab />}
        {tab === 'tutor'      && <TutorTab />}
      </div>

      {/* ── Bottom nav ── */}
      <nav style={{
        display: 'flex',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '10px 4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 10,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--brand)' : 'var(--text-3)',
              borderTop: `2px solid ${tab === t.id ? 'var(--brand)' : 'transparent'}`,
              transition: 'all 0.15s',
            }}
          >
            <i className={`ti ${t.icon}`} style={{ fontSize: 20 }} />
            {t.label}
          </button>
        ))}
      </nav>
    </>
  )
}

/* ── Home Tab content ─────────────────────────────────────── */
function HomeTab({
  situations,
  todayWord,
  onTabChange,
}: {
  situations: Situation[]
  todayWord: typeof ALL_VOCAB[0]
  onTabChange: (t: Tab) => void
}) {
  return (
    <>
      {/* Greeting */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>오늘도 5분 영어! 💪</h2>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
          상황을 선택해 대화를 연습하고<br />실제 원어민 표현을 익혀보세요.
        </p>
      </div>

      {/* Progress */}
      <div style={{
        background: 'var(--brand-light)', borderRadius: 'var(--r-md)',
        padding: '14px 16px', marginBottom: 16,
        border: '1px solid var(--brand-mid)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'var(--brand-dark)', marginBottom: 8 }}>
          <span>오늘의 진행도</span><span>2 / {situations.length} 완료</span>
        </div>
        <div style={{ height: 6, background: 'var(--brand-mid)', borderRadius: 3 }}>
          <div style={{ height: 6, background: 'var(--brand)', borderRadius: 3, width: `${(2/Math.max(situations.length,1))*100}%`, transition: 'width 0.6s ease' }} />
        </div>
      </div>

      {/* Situation grid */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10 }}>
        상황별 학습
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {situations.map(s => (
          <Link
            key={s.id}
            href={`/situation/${s.id}`}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: '14px 12px',
              textDecoration: 'none', color: 'inherit', display: 'block',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{s.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{s.subtitle}</div>
            {s.badge && (
              <span style={{
                display: 'inline-block', fontSize: 10, padding: '2px 8px',
                borderRadius: 20, marginTop: 6, fontWeight: 600,
                background: s.badge === 'hot' ? 'var(--warn-bg)' : 'var(--success-bg)',
                color: s.badge === 'hot' ? 'var(--warn)' : 'var(--success)',
              }}>
                {s.badge === 'hot' ? '🔥 인기' : '✨ 신규'}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Today's word */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10 }}>
        오늘의 단어
      </div>
      <button
        onClick={() => onTabChange('dictionary')}
        style={{
          width: '100%', textAlign: 'left',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)', padding: '14px 16px', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{todayWord.word}</div>
            <div className="phonetic" style={{ color: 'var(--brand)', marginTop: 2 }}>{todayWord.phonetic}</div>
          </div>
          <span style={{ fontSize: 20 }}>📌</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{todayWord.meaning}</div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic' }}>"{todayWord.example}"</div>
      </button>
    </>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { FULL_VOCAB as ALL_VOCAB, CATEGORY_LABELS, type WordCategory } from '@/lib/dictionary'

const ALL_CATS = Object.keys(CATEGORY_LABELS) as WordCategory[]
const STORAGE_KEY = 'dailyen_flashcard'

interface SavedState {
  cat: WordCategory | 'all'
  level: 'all' | 'essential' | 'advanced'
  idx: number
  known: string[]
  again: string[]
}

export default function FlashcardTab() {
  const [cat, setCat]     = useState<WordCategory | 'all'>('all')
  const [level, setLevel] = useState<'all' | 'essential' | 'advanced'>('all')
  const [idx, setIdx]     = useState(0)
  const [flipped, setFlip] = useState(false)
  const [known, setKnown]  = useState<Set<string>>(new Set())
  const [again, setAgain]  = useState<Set<string>>(new Set())
  const [showSummary, setShowSummary] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // ── 앱 시작 시 localStorage에서 복원 ──────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const s: SavedState = JSON.parse(raw)
        setCat(s.cat ?? 'all')
        setLevel(s.level ?? 'all')
        setIdx(s.idx ?? 0)
        setKnown(new Set(s.known ?? []))
        setAgain(new Set(s.again ?? []))
      }
    } catch {}
    setLoaded(true)
  }, [])

  // ── 상태 변경 시 localStorage에 저장 ─────────────────────
  useEffect(() => {
    if (!loaded) return
    const s: SavedState = {
      cat, level, idx,
      known: Array.from(known),
      again: Array.from(again),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  }, [cat, level, idx, known, again, loaded])

  const words = ALL_VOCAB.filter(w => {
    if (cat !== 'all' && w.category !== cat) return false
    if (level !== 'all' && w.level !== level) return false
    return true
  })

  const card   = words[idx]
  const total  = words.length
  const pct    = total > 0 ? Math.round(((known.size + again.size) / total) * 100) : 0

  // 카테고리/레벨 변경 시 초기화
  function changeFilter(newCat: typeof cat, newLevel: typeof level) {
    setCat(newCat)
    setLevel(newLevel)
    setIdx(0); setFlip(false)
    setKnown(new Set()); setAgain(new Set())
    setShowSummary(false)
  }

  function next(knew: boolean) {
    if (!card) return
    if (knew) setKnown(p => new Set(p).add(card.word))
    else      setAgain(p => new Set(p).add(card.word))
    setFlip(false)
    const nextIdx = idx + 1
    if (nextIdx >= total) setShowSummary(true)
    else setIdx(nextIdx)
  }

  function reset() {
    setIdx(0); setFlip(false)
    setKnown(new Set()); setAgain(new Set())
    setShowSummary(false)
  }

  if (!loaded) return null

  return (
    <>
      {/* ── 카테고리 ── */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 8 }}>카테고리</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <button onClick={() => changeFilter('all', level)} style={pill(cat === 'all')}>전체 {ALL_VOCAB.length}</button>
          {ALL_CATS.map(c => (
            <button key={c} onClick={() => changeFilter(c, level)} style={pill(cat === c)}>
              {CATEGORY_LABELS[c].icon} {CATEGORY_LABELS[c].label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ── 레벨 ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {(['all', 'essential', 'advanced'] as const).map(l => (
          <button key={l} onClick={() => changeFilter(cat, l)} style={{
            flex: 1, padding: '7px', fontSize: 11, fontWeight: 600,
            border: '1px solid', borderRadius: 'var(--r-sm)', cursor: 'pointer',
            borderColor: level === l ? 'var(--brand)' : 'var(--border)',
            background: level === l ? 'var(--brand)' : 'var(--surface)',
            color: level === l ? '#fff' : 'var(--text-2)',
          }}>
            {l === 'all' ? '전체' : l === 'essential' ? '⭐ 필수' : '🔥 고급'}
          </button>
        ))}
      </div>

      {/* ── 진행도 ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>
        <span>{showSummary ? '완료! 🎉' : `${idx + 1} / ${total}`}</span>
        <span style={{ fontWeight: 600, color: pct === 100 ? 'var(--success)' : 'var(--text-3)' }}>{pct}% 완료</span>
      </div>
      <div style={{ height: 5, background: 'var(--surface-3)', borderRadius: 3, marginBottom: 6, overflow: 'hidden' }}>
        <div style={{ height: 5, borderRadius: 3, background: 'var(--brand)', width: `${pct}%`, transition: 'width .4s ease' }} />
      </div>

      {/* 저장 알림 */}
      <div style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'right', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
        <i className="ti ti-device-floppy" style={{ fontSize: 12 }} /> 진행상황 자동 저장됨
      </div>

      {/* ── 점수 ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[
          { label: '외웠어요 ✅', count: known.size,  bg: 'var(--success-bg)', color: 'var(--success)' },
          { label: '다시 볼게요 🔁', count: again.size, bg: 'var(--warn-bg)',    color: 'var(--warn)'    },
          { label: '남은 카드 📚', count: Math.max(0, total - known.size - again.size), bg: 'var(--surface-2)', color: 'var(--text-2)' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', background: s.bg, borderRadius: 'var(--r-sm)' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 9, color: s.color, fontWeight: 600, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── 완료 화면 ── */}
      {showSummary ? (
        <div style={{ textAlign: 'center', padding: '28px 16px', background: 'var(--brand-light)', borderRadius: 'var(--r-lg)', border: '1px solid var(--brand-mid)' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-dark)', marginBottom: 8 }}>세션 완료!</div>
          <div style={{ fontSize: 13, color: 'var(--brand)', marginBottom: 20, lineHeight: 1.6 }}>
            외운 단어 <b>{known.size}</b>개<br />
            다시 볼 단어 <b>{again.size}</b>개
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {again.size > 0 && (
              <button onClick={reset} style={{ flex: 1, padding: '11px', background: 'var(--warn)', color: '#fff', border: 'none', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                🔁 처음부터 다시
              </button>
            )}
            <button onClick={reset} style={{ flex: 1, padding: '11px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              ↩ 처음부터
            </button>
          </div>
        </div>
      ) : card ? (
        <>
          {/* ── 플래시카드 ── */}
          <div className="fc-scene" style={{ marginBottom: 14 }}>
            <div className={`fc-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlip(f => !f)}
              style={{ width: '100%', height: 210, position: 'relative', cursor: 'pointer' }}>
              {/* 앞면 */}
              <div className="fc-face" style={{
                position: 'absolute', inset: 0,
                background: 'var(--brand-light)', border: '1px solid var(--brand-mid)',
                borderRadius: 'var(--r-lg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
              }}>
                <div style={{ position: 'absolute', top: 12, left: 12, fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'var(--brand)', color: '#fff', fontWeight: 600 }}>
                  {CATEGORY_LABELS[card.category].icon} {CATEGORY_LABELS[card.category].label}
                </div>
                {card.level === 'advanced' && (
                  <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'var(--warn-bg)', color: 'var(--warn)', fontWeight: 600 }}>🔥 고급</div>
                )}
                <div style={{ fontSize: card.word.length > 15 ? 20 : 26, fontWeight: 800, color: 'var(--brand-dark)', marginBottom: 8, textAlign: 'center' }}>
                  {card.word}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--brand)' }}>{card.phonetic}</div>
                <div style={{ marginTop: 18, fontSize: 11, color: 'var(--brand-mid)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <i className="ti ti-hand-click" style={{ fontSize: 13 }} /> 탭하여 뜻 보기
                </div>
              </div>
              {/* 뒷면 */}
              <div className="fc-face fc-back" style={{
                position: 'absolute', inset: 0,
                background: 'var(--brand)', borderRadius: 'var(--r-lg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
              }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>뜻</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 12, lineHeight: 1.4 }}>{card.meaning}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 1.6, fontStyle: 'italic' }}>"{card.example}"</div>
              </div>
            </div>
          </div>

          {/* ── 버튼 ── */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button onClick={() => next(false)} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: 'var(--r-sm)', background: 'var(--warn-bg)', color: 'var(--warn)', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <i className="ti ti-x" /> 다시 볼게요
            </button>
            <button onClick={() => next(true)} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: 'var(--r-sm)', background: 'var(--success-bg)', color: 'var(--success)', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <i className="ti ti-check" /> 외웠어요!
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => { setIdx(i => Math.max(0, i-1)); setFlip(false) }} style={navBtn}>
              <i className="ti ti-arrow-left" /> 이전
            </button>
            <button onClick={reset} style={navBtn}>
              <i className="ti ti-refresh" /> 처음부터
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>단어가 없습니다.</div>
      )}
    </>
  )
}

const pill = (active: boolean): React.CSSProperties => ({
  padding: '5px 10px', borderRadius: 20, border: '1px solid',
  borderColor: active ? 'var(--brand)' : 'var(--border)',
  background: active ? 'var(--brand)' : 'var(--surface)',
  color: active ? '#fff' : 'var(--text-2)',
  fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
})

const navBtn: React.CSSProperties = {
  padding: '8px 16px', border: '1px solid var(--border)',
  borderRadius: 'var(--r-sm)', background: 'var(--surface)',
  color: 'var(--text-1)', fontSize: 12, cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 4,
}

'use client'
// components/learning/DictionaryTab.tsx
import { useState, useCallback, useRef } from 'react'
import type { DictionaryEntry } from '@/types'

const QUICK_WORDS = ['leverage', 'stakeholder', 'synergy', 'proactive', 'scalable', 'deliverable', 'pivot', 'circle back']

export default function DictionaryTab() {
  const [query, setQuery]   = useState('')
  const [result, setResult] = useState<DictionaryEntry[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [saved, setSaved]   = useState<Set<string>>(new Set())
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const lookup = useCallback(async (word: string) => {
    if (!word.trim()) { setResult(null); setError(''); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch(`/api/word-lookup?word=${encodeURIComponent(word.trim())}`)
      if (!res.ok) { setError('단어를 찾을 수 없어요. 다른 단어를 검색해보세요.'); return }
      setResult(await res.json())
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  function onInput(v: string) {
    setQuery(v)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => lookup(v), 550)
  }

  function playAudio(entries: DictionaryEntry[]) {
    for (const e of entries) {
      for (const p of e.phonetics) {
        if (p.audio) {
          audioRef.current?.pause()
          audioRef.current = new Audio(p.audio)
          audioRef.current.play().catch(() => {})
          return
        }
      }
    }
  }

  async function toggleSave(entry: DictionaryEntry) {
    const word = entry.word
    const meaning = entry.meanings?.[0]?.definitions?.[0]?.definition?.substring(0, 120) ?? ''
    const phonetic = entry.phonetic ?? entry.phonetics.find(p => p.text)?.text ?? ''
    const example_en = entry.meanings?.[0]?.definitions?.[0]?.example ?? ''
    const isSaved = saved.has(word)

    try {
      const method = isSaved ? 'DELETE' : 'POST'
      await fetch('/api/word-save', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, meaning, phonetic, example_en }),
      })
      setSaved(prev => {
        const n = new Set(prev)
        isSaved ? n.delete(word) : n.add(word)
        return n
      })
    } catch {}
  }

  const phonetic = result?.[0]?.phonetic ?? result?.[0]?.phonetics?.find(p => p.text)?.text ?? ''
  const hasAudio = result?.some(e => e.phonetics.some(p => p.audio))

  return (
    <>
      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <i className="ti ti-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontSize: 16 }} />
        <input
          value={query}
          onChange={e => onInput(e.target.value)}
          placeholder="영어 단어를 검색하세요 (예: leverage)"
          style={{
            width: '100%', padding: '10px 12px 10px 36px',
            border: '1px solid var(--border-mid)', borderRadius: 'var(--r-sm)',
            fontSize: 14, background: 'var(--surface)', color: 'var(--text-1)', outline: 'none',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border-mid)')}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 30, display: 'flex', justifyContent: 'center', gap: 4 }}>
          {[0,1,2].map(i => <span key={i} className="dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--brand)', display: 'inline-block', animationDelay: `${i*0.2}s` }} />)}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-2)' }}>
          <i className="ti ti-alert-circle" style={{ fontSize: 32, display: 'block', marginBottom: 8, color: 'var(--text-3)' }} />
          {error}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '16px' }}>
          {/* Word header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{result[0].word}</div>
              {phonetic && <div className="phonetic" style={{ color: 'var(--brand)', marginTop: 3 }}>{phonetic}</div>}
            </div>
            {hasAudio && (
              <button
                onClick={() => playAudio(result)}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'var(--brand-light)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--brand)', fontSize: 18, flexShrink: 0,
                }}
              >
                <i className="ti ti-volume" />
              </button>
            )}
          </div>

          {/* Meanings */}
          {result[0].meanings?.slice(0, 3).map((m, mi) => (
            <div key={mi} style={{ marginBottom: 12 }}>
              <span style={{
                display: 'inline-block', fontSize: 11, padding: '2px 9px',
                borderRadius: 20, marginBottom: 8, fontWeight: 600,
                background: 'var(--brand-light)', color: 'var(--brand-dark)',
              }}>{m.partOfSpeech}</span>
              {m.definitions.slice(0, 2).map((d, di) => (
                <div key={di} style={{ paddingLeft: 12, borderLeft: '2px solid var(--brand-mid)', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-1)' }}>{d.definition}</div>
                  {d.example && <div style={{ fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic', marginTop: 3 }}>"{d.example}"</div>}
                </div>
              ))}
              {m.synonyms?.length > 0 && (
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                  유사어: {m.synonyms.slice(0, 4).map(s => (
                    <span key={s} onClick={() => { setQuery(s); lookup(s) }} style={{
                      display: 'inline-block', background: 'var(--surface-2)', borderRadius: 20,
                      padding: '2px 8px', margin: '0 3px 3px 0', cursor: 'pointer', color: 'var(--brand-dark)',
                    }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Save button */}
          <button
            onClick={() => toggleSave(result[0])}
            style={{
              width: '100%', padding: '10px', marginTop: 4,
              background: saved.has(result[0].word) ? 'var(--success-bg)' : 'var(--brand)',
              color: saved.has(result[0].word) ? 'var(--success)' : '#fff',
              border: 'none', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s',
            }}
          >
            <i className={`ti ${saved.has(result[0].word) ? 'ti-check' : 'ti-bookmark'}`} />
            {saved.has(result[0].word) ? '저장됨' : '단어장에 저장'}
          </button>
        </div>
      )}

      {/* Quick suggestions */}
      {!result && !loading && !error && (
        <>
          <div style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginBottom: 12 }}>
            <i className="ti ti-bulb" style={{ fontSize: 14 }} /> 눌러서 바로 검색
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 20 }}>
            {QUICK_WORDS.map(w => (
              <span key={w} onClick={() => { setQuery(w); lookup(w) }} style={{
                background: 'var(--brand-light)', borderRadius: 20, padding: '5px 12px',
                fontSize: 12, color: 'var(--brand-dark)', cursor: 'pointer', fontWeight: 500,
              }}>{w}</span>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10 }}>
            직장인 필수 표현
          </div>
          {['circle back', 'take offline', 'pain point', 'low-hanging fruit', 'touch base'].map(w => (
            <div key={w} onClick={() => { setQuery(w); lookup(w) }} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: 8, cursor: 'pointer',
            }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{w}</span>
              <i className="ti ti-chevron-right" style={{ fontSize: 16, color: 'var(--text-3)' }} />
            </div>
          ))}
        </>
      )}
    </>
  )
}

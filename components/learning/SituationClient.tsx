'use client'
// components/learning/SituationClient.tsx
import { useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { SituationWithContent } from '@/types'

interface Props { situation: SituationWithContent }
type SubTab = 'dialog' | 'vocab'

export default function SituationClient({ situation }: Props) {
  const router = useRouter()
  const [subTab, setSubTab]   = useState<SubTab>('dialog')
  const [setIdx, setSetIdx]   = useState(0)   // 현재 대화 세트 인덱스
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [aiText, setAiText]   = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  // dialog_set 기준으로 그룹화
  const dialogSets = useMemo(() => {
    const map = new Map<number, typeof situation.expressions>()
    for (const e of situation.expressions) {
      const set = (e as typeof e & { dialog_set?: number }).dialog_set ?? 1
      if (!map.has(set)) map.set(set, [])
      map.get(set)!.push(e)
    }
    // 세트 번호 순서로 정렬
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([setNum, exprs]) => ({
        setNum,
        exprs: [...exprs].sort((a, b) => a.sequence - b.sequence),
      }))
  }, [situation.expressions])

  const totalSets  = dialogSets.length
  const currentSet = dialogSets[setIdx] ?? dialogSets[0]
  const sorted     = currentSet?.exprs ?? []

  // 세트 변경 시 초기화
  function changeSet(idx: number) {
    setSetIdx(idx)
    setRevealed(new Set())
    setAiText('')
  }

  function toggleReveal(id: string) {
    setRevealed(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function revealAll() {
    setRevealed(new Set(sorted.map(e => e.id)))
  }

  async function explainDialog() {
    if (aiLoading) { abortRef.current?.abort(); return }
    setAiText('')
    setAiLoading(true)
    abortRef.current = new AbortController()

    const prompt = `"${situation.title}" 상황의 비즈니스 영어 대화입니다 (세트 ${setIdx + 1}):
${sorted.map(e => `${e.role}: ${e.sentence_en}`).join('\n')}

1. 이 대화에서 가장 실용적인 표현 2개를 골라 설명해주세요
2. 각 표현의 업그레이드 버전 or 유사 표현도 1개씩 알려주세요
3. 실제 직장에서 쓸 수 있는 팁을 한 줄로 마무리해주세요`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
        signal: abortRef.current.signal,
      })
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of decoder.decode(value).split('\n')) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            const { text } = JSON.parse(line.slice(6))
            setAiText(prev => prev + text)
          }
        }
      }
    } catch (e: unknown) {
      if ((e as Error).name !== 'AbortError') setAiText('오류가 발생했습니다.')
    } finally {
      setAiLoading(false)
    }
  }

  const SET_LABELS: Record<number, string> = {
    1: '기본 대화',
    2: '심화 대화',
    3: '고급 대화',
  }

  return (
    <>
      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '12px 18px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 20, display: 'flex' }}
          >
            <i className="ti ti-arrow-left" />
          </button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{situation.icon} {situation.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{situation.subtitle}</div>
          </div>
        </div>

        {/* 대화/단어 탭 */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['dialog', 'vocab'] as SubTab[]).map(t => (
            <button key={t} onClick={() => setSubTab(t)} style={{
              flex: 1, padding: '9px', fontSize: 12, fontWeight: 600,
              border: '1px solid',
              borderColor: subTab === t ? 'var(--brand)' : 'var(--border)',
              borderRadius: 'var(--r-sm)',
              background: subTab === t ? 'var(--brand)' : 'var(--surface)',
              color: subTab === t ? '#fff' : 'var(--text-2)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {t === 'dialog' ? '💬 대화 연습' : '📖 핵심 단어'}
            </button>
          ))}
        </div>
      </header>

      <div className="scroll-area fade-up" key={`${subTab}-${setIdx}`}>
        {subTab === 'dialog' ? (
          <>
            {/* ── 세트 네비게이터 ── */}
            {totalSets > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--surface-2)', borderRadius: 'var(--r-md)',
                padding: '10px 14px', marginBottom: 14,
                border: '1px solid var(--border)',
              }}>
                <button
                  onClick={() => changeSet(Math.max(0, setIdx - 1))}
                  disabled={setIdx === 0}
                  style={{
                    width: 32, height: 32, borderRadius: '50%', border: 'none',
                    background: setIdx === 0 ? 'var(--surface-3)' : 'var(--brand-light)',
                    color: setIdx === 0 ? 'var(--text-3)' : 'var(--brand)',
                    cursor: setIdx === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                  }}
                >
                  <i className="ti ti-chevron-left" />
                </button>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>
                    {SET_LABELS[currentSet.setNum] ?? `세트 ${currentSet.setNum}`}
                  </div>
                  {/* 세트 도트 인디케이터 */}
                  <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 5 }}>
                    {dialogSets.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => changeSet(i)}
                        style={{
                          width: i === setIdx ? 18 : 6,
                          height: 6,
                          borderRadius: 3,
                          border: 'none',
                          background: i === setIdx ? 'var(--brand)' : 'var(--brand-mid)',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'all 0.2s',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                    {setIdx + 1} / {totalSets}
                  </div>
                </div>

                <button
                  onClick={() => changeSet(Math.min(totalSets - 1, setIdx + 1))}
                  disabled={setIdx === totalSets - 1}
                  style={{
                    width: 32, height: 32, borderRadius: '50%', border: 'none',
                    background: setIdx === totalSets - 1 ? 'var(--surface-3)' : 'var(--brand)',
                    color: setIdx === totalSets - 1 ? 'var(--text-3)' : '#fff',
                    cursor: setIdx === totalSets - 1 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                  }}
                >
                  <i className="ti ti-chevron-right" />
                </button>
              </div>
            )}

            {/* 힌트 */}
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-3)', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <i className="ti ti-eye" style={{ fontSize: 13 }} />
              말풍선을 탭하면 영어 문장이 나타납니다
              <button onClick={revealAll} style={{
                marginLeft: 8, fontSize: 10, padding: '2px 8px',
                border: '1px solid var(--border)', borderRadius: 20,
                background: 'none', cursor: 'pointer', color: 'var(--text-2)',
              }}>
                전체 보기
              </button>
            </div>

            {/* 말풍선 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {sorted.map((expr) => {
                const isRight    = expr.role === 'B'
                const isRevealed = revealed.has(expr.id)
                return (
                  <div key={expr.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexDirection: isRight ? 'row-reverse' : 'row' }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700,
                      background: isRight ? 'var(--success-bg)' : 'var(--brand-light)',
                      color: isRight ? 'var(--success)' : 'var(--brand)',
                    }}>
                      {expr.role}
                    </div>
                    <div
                      onClick={() => toggleReveal(expr.id)}
                      className={isRight ? 'bubble-right' : 'bubble-left'}
                      style={{ maxWidth: '75%', padding: '10px 14px', cursor: 'pointer' }}
                    >
                      <div className={isRevealed ? '' : 'blurred'} style={{ fontSize: 13, lineHeight: 1.5, color: isRight ? '#fff' : 'var(--text-1)', marginBottom: 4 }}>
                        {expr.sentence_en}
                      </div>
                      <div style={{ fontSize: 11, color: isRight ? 'rgba(255,255,255,0.65)' : 'var(--text-3)', lineHeight: 1.4 }}>
                        {expr.sentence_ko}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 다음 세트 버튼 (마지막이 아닐 때) */}
            {setIdx < totalSets - 1 && (
              <button
                onClick={() => changeSet(setIdx + 1)}
                style={{
                  width: '100%', padding: '12px', marginBottom: 10,
                  background: 'var(--brand)', color: '#fff',
                  border: 'none', borderRadius: 'var(--r-md)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                다음 대화 보기 <i className="ti ti-arrow-right" />
              </button>
            )}

            {/* AI 버튼 */}
            <button
              onClick={explainDialog}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 14px', background: 'var(--brand-light)',
                border: '1px solid var(--brand-mid)', borderRadius: 'var(--r-md)',
                cursor: 'pointer', fontSize: 13, color: 'var(--brand-dark)', fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              <i className="ti ti-sparkles" style={{ fontSize: 16 }} />
              {aiLoading ? 'AI 분석 중... (탭하면 중단)' : 'AI에게 이 대화 더 배우기'}
            </button>

            {/* AI 응답 */}
            {(aiText || aiLoading) && (
              <div style={{
                marginTop: 10, padding: '14px 16px',
                background: 'var(--surface-2)', borderRadius: 'var(--r-md)',
                borderLeft: '3px solid var(--brand)',
                fontSize: 13, lineHeight: 1.7, color: 'var(--text-1)',
                whiteSpace: 'pre-wrap',
              }}>
                {aiText || (
                  <span style={{ display: 'flex', gap: 4 }}>
                    {[0,1,2].map(i => <span key={i} className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', display: 'inline-block', animationDelay: `${i*0.2}s` }} />)}
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          /* 단어 탭 */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {situation.vocabularies.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-3)' }}>단어 데이터가 없습니다.</div>
            )}
            {situation.vocabularies.map(v => (
              <div key={v.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)', padding: '14px 16px',
              }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{v.word}</div>
                {v.phonetic && <div className="phonetic" style={{ color: 'var(--brand)', marginBottom: 6 }}>{v.phonetic}</div>}
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{v.meaning}</div>
                {v.example_en && <div style={{ fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic' }}>"{v.example_en}"</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

'use client'
// components/learning/TutorTab.tsx
import { useState, useRef, useEffect } from 'react'

interface Msg { role: 'user' | 'assistant'; content: string }

const QUICK = [
  "'circle back'이 뭐예요?",
  "'take it offline' 언제 써요?",
  "회의 시작할 때 쓰는 표현",
  "이메일 마무리 영어 표현",
  "발표 시작할 때 자연스러운 표현",
  "'leverage' 실전 예문 알려줘",
]

const INIT: Msg = {
  role: 'assistant',
  content: '안녕하세요! 저는 AI 영어 튜터예요 ✨\n\n궁금한 비즈니스 영어 표현을 뭐든 물어보세요. 회의, 이메일, 발표 등 실제 직장에서 바로 쓸 수 있는 표현을 알려드릴게요!',
}

export default function TutorTab() {
  const [msgs, setMsgs] = useState<Msg[]>([INIT])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController>()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  async function send(text?: string) {
    const q = (text ?? input).trim()
    if (!q || loading) return
    setInput('')

    const userMsg: Msg = { role: 'user', content: q }
    const history = [...msgs, userMsg].filter(m => m.role !== 'assistant' || msgs.indexOf(m) > 0)
    setMsgs(prev => [...prev, userMsg, { role: 'assistant', content: '' }])
    setLoading(true)

    abortRef.current = new AbortController()
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      })

      const reader = res.body!.getReader()
      const dec = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of dec.decode(value).split('\n')) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            const { text } = JSON.parse(line.slice(6))
            setMsgs(prev => {
              const copy = [...prev]
              copy[copy.length - 1] = { ...copy[copy.length - 1], content: copy[copy.length - 1].content + text }
              return copy
            })
          }
        }
      }
    } catch (e: unknown) {
      if ((e as Error).name !== 'AbortError') {
        setMsgs(prev => { const c = [...prev]; c[c.length-1] = { role: 'assistant', content: '오류가 발생했습니다. 다시 시도해주세요.' }; return c })
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100svh - 180px)' }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
        AI 영어 튜터 <span style={{ fontSize: 16 }}>✨</span>
      </div>

      {/* Quick phrase buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {QUICK.map(q => (
          <button key={q} onClick={() => send(q)} style={{
            padding: '6px 10px', border: '1px solid var(--brand-mid)', borderRadius: 20,
            fontSize: 11, color: 'var(--brand-dark)', cursor: 'pointer',
            background: 'var(--brand-light)', fontWeight: 500,
            transition: 'all 0.15s',
          }}>
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '88%',
            padding: '11px 13px',
            borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
            background: m.role === 'user' ? 'var(--brand)' : 'var(--surface-2)',
            color: m.role === 'user' ? '#fff' : 'var(--text-1)',
            fontSize: 13,
            lineHeight: 1.65,
            whiteSpace: 'pre-wrap',
          }}>
            {m.content || (loading && i === msgs.length - 1
              ? <span style={{ display: 'flex', gap: 4 }}>
                  {[0,1,2].map(j => <span key={j} className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', display: 'inline-block', animationDelay: `${j*0.2}s` }} />)}
                </span>
              : '')}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', gap: 8,
        paddingTop: 10, borderTop: '1px solid var(--border)',
        position: 'sticky', bottom: 0, background: 'var(--surface)',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
          placeholder="영어 표현이 궁금하세요?"
          style={{
            flex: 1, padding: '10px 14px',
            border: '1px solid var(--border-mid)', borderRadius: 22,
            fontSize: 13, background: 'var(--surface)', color: 'var(--text-1)', outline: 'none',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border-mid)')}
        />
        <button onClick={() => send()} style={{
          width: 38, height: 38, borderRadius: '50%',
          background: loading ? 'var(--surface-3)' : 'var(--brand)',
          border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: loading ? 'var(--text-3)' : '#fff', fontSize: 17, flexShrink: 0,
        }}>
          <i className="ti ti-send" />
        </button>
      </div>
    </div>
  )
}

// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const SYSTEM = `당신은 한국 직장인을 위한 친절하고 실용적인 비즈니스 영어 튜터입니다.

역할:
- 비즈니스 영어 표현, 이메일, 회의, 프레젠테이션, 전화 영어 관련 질문에 답합니다
- 답변은 항상 한국어로 하되, 영어 예문은 영어로 제시합니다
- 실제 직장에서 바로 쓸 수 있는 실용적인 표현을 우선합니다
- 3~5문장 이내로 간결하게 답변합니다
- 예문은 1~2개만 제시합니다
- 원어민이 실제로 쓰는 자연스러운 표현을 알려줍니다`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('❌ ANTHROPIC_API_KEY가 없습니다')
      return Response.json({ error: 'API 키 없음' }, { status: 500 })
    }

    console.log('✅ API Key 확인:', apiKey.slice(0, 20) + '...')

    const client = new Anthropic({ apiKey })

    // 스트리밍 대신 일반 호출로 먼저 테스트
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: SYSTEM,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    
    // SSE 형식으로 반환
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (err: unknown) {
    // 에러 상세 출력
    console.error('❌ Chat API 에러:', JSON.stringify(err, null, 2))
    if (err instanceof Error) {
      console.error('❌ 에러 메시지:', err.message)
      console.error('❌ 에러 스택:', err.stack)
    }
    return Response.json(
      { error: err instanceof Error ? err.message : '알 수 없는 오류' },
      { status: 500 }
    )
  }
}

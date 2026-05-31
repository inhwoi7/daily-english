# DailyEN — 직장인 영어 학습 앱

매일 틈날 때마다 5분, 직장인을 위한 실전 영어 학습 앱.

## 기술 스택

| Layer       | 기술                                   |
|-------------|----------------------------------------|
| Frontend    | Next.js 15 (App Router) + TypeScript   |
| Styling     | Tailwind CSS + CSS Variables           |
| Database    | Supabase (PostgreSQL + RLS)            |
| AI          | Anthropic Claude (Streaming)           |
| Dictionary  | Free Dictionary API (GitHub OSS)       |
| 배포         | Vercel (자동 CI/CD)                    |

## 아키텍처

```
app/
├── page.tsx                    # 홈 (SSG + ISR 10분)
├── situation/[id]/page.tsx     # 상황별 학습 (SSG)
├── api/
│   ├── chat/route.ts           # AI 튜터 (Streaming SSE)
│   ├── word-save/route.ts      # 단어 저장/삭제 (Supabase)
│   └── word-lookup/route.ts    # 사전 API 프록시 (캐시 24h)
components/learning/
├── HomeClient.tsx              # 홈 탭 + 하단 내비게이션
├── SituationClient.tsx         # 대화 연습 + AI 설명
├── DictionaryTab.tsx           # 실시간 단어 검색
├── FlashcardTab.tsx            # 플래시카드 (18단어)
├── SavedTab.tsx                # 내 단어장 (Supabase)
└── TutorTab.tsx                # AI 스트리밍 채팅
lib/
├── supabase.ts                 # Browser + Server 클라이언트
└── dictionary.ts               # Free Dictionary API 래퍼
supabase/migrations/
└── 001_initial_schema.sql      # DDL + RLS + Seed 데이터
```

## 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone https://github.com/YOUR_ID/daily-en.git
cd daily-en
npm install
```

### 2. Supabase 설정

1. [app.supabase.com](https://app.supabase.com) 에서 새 프로젝트 생성
2. **SQL Editor** → `supabase/migrations/001_initial_schema.sql` 전체 붙여넣기 → Run
3. Settings → API에서 `Project URL`과 `anon public` 키 복사

### 3. 환경변수 설정

```bash
cp .env.local.example .env.local
# .env.local 파일을 편집해 실제 값 입력
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. 개발 서버 실행

```bash
npm run dev
# → http://localhost:3000
```

## Vercel 배포

```bash
# 1. GitHub에 push
git add . && git commit -m "init" && git push

# 2. vercel.com → New Project → GitHub 레포 선택
# 3. Environment Variables에 .env.local 값 동일하게 입력
# 4. Deploy 클릭 → 1분 후 라이브!
```

도메인 연결: Vercel Dashboard → Settings → Domains → `dasangdam.com` 추가

## 데이터베이스 확장

Supabase SQL Editor에서 상황/문장/단어를 추가할 수 있습니다:

```sql
-- 새 상황 추가
insert into situations (title, icon, subtitle, badge, sort_order)
values ('콘퍼런스콜', '📞', '전화 영어', 'new', 7);

-- 새 대화 추가 (위 상황의 id 사용)
insert into expressions (situation_id, role, sentence_ko, sentence_en, sequence)
values ('UUID_HERE', 'A', '잘 들리시나요?', 'Can you hear me clearly?', 1);
```

## 주요 기능

- **대화 연습**: 말풍선 탭 → 영어 문장 reveal, AI가 핵심 표현 스트리밍 설명
- **실시간 사전**: Free Dictionary API (GitHub OSS) — 발음 오디오 포함
- **플래시카드**: 비즈니스 필수 18단어, 알아요/몰라요 분류
- **내 단어장**: Supabase에 저장, 상태 관리 (신규/학습중/완료)
- **AI 튜터**: Claude 스트리밍 채팅, 직장인 맞춤 시스템 프롬프트
- **ISR**: 10분 주기 자동 재빌드, Supabase API 호출 최소화

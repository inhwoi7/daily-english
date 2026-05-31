-- ============================================================
-- DailyEN — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. SITUATIONS (상황 카테고리)
create table if not exists situations (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  icon        text not null,
  subtitle    text,
  badge       text check (badge in ('hot', 'new', null)),
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- 2. EXPRESSIONS (대화 문장)
create table if not exists expressions (
  id           uuid primary key default gen_random_uuid(),
  situation_id uuid references situations(id) on delete cascade,
  role         char(1) check (role in ('A', 'B')),
  sentence_ko  text not null,
  sentence_en  text not null,
  sequence     int not null,
  created_at   timestamptz default now()
);

-- 3. VOCABULARIES (핵심 단어)
create table if not exists vocabularies (
  id           uuid primary key default gen_random_uuid(),
  situation_id uuid references situations(id) on delete cascade,
  word         text not null,
  phonetic     text,
  meaning      text not null,
  example_en   text,
  created_at   timestamptz default now()
);

-- 4. USER_WORDS (사용자 저장 단어장)
create table if not exists user_words (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  word        text not null,
  meaning     text,
  phonetic    text,
  example_en  text,
  status      text default 'new' check (status in ('new', 'learning', 'mastered')),
  saved_at    timestamptz default now(),
  unique(user_id, word)
);

-- 5. USER_PROGRESS (학습 진도)
create table if not exists user_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  situation_id uuid references situations(id) on delete cascade,
  completed    boolean default false,
  streak_days  int default 0,
  last_studied timestamptz,
  unique(user_id, situation_id)
);

-- ── INDEXES ──────────────────────────────────────────────────
create index on expressions(situation_id, sequence);
create index on vocabularies(situation_id);
create index on user_words(user_id, status);
create index on user_progress(user_id);

-- ── ROW-LEVEL SECURITY ────────────────────────────────────────
alter table situations    enable row level security;
alter table expressions   enable row level security;
alter table vocabularies  enable row level security;
alter table user_words    enable row level security;
alter table user_progress enable row level security;

-- Public read for content tables
create policy "public read situations"   on situations   for select using (true);
create policy "public read expressions"  on expressions  for select using (true);
create policy "public read vocabularies" on vocabularies for select using (true);

-- Authenticated CRUD for personal tables
create policy "user manage own words"    on user_words    for all using (auth.uid() = user_id);
create policy "user manage own progress" on user_progress for all using (auth.uid() = user_id);

-- ── SEED DATA ─────────────────────────────────────────────────
insert into situations (title, icon, subtitle, badge, sort_order) values
  ('해외 바이어 미팅',   '✈️', '비즈니스 협상 영어',     'hot', 1),
  ('이메일 영어',        '📧', '프로 이메일 표현',        'new', 2),
  ('프레젠테이션',       '📊', '발표 & 설명 영어',        'hot', 3),
  ('비즈니스 스몰톡',    '☕', '자연스러운 일상 영어',    null,  4),
  ('전화 영어',          '📞', '통화 & 컨퍼런스콜',       'new', 5),
  ('협상 & 계약',        '🤝', '딜 클로징 영어',          null,  6);

-- Expressions for situation 1 (해외 바이어 미팅)
with s as (select id from situations where title = '해외 바이어 미팅')
insert into expressions (situation_id, role, sentence_ko, sentence_en, sequence) values
  ((select id from s), 'A', '좋은 아침입니다! 드디어 직접 뵙게 되어 반갑습니다.', 'Good morning! It''s a pleasure to finally meet you in person.', 1),
  ((select id from s), 'B', '저도요! 이 미팅을 기대하고 있었습니다.',               'Likewise! I''ve been looking forward to this meeting.',           2),
  ((select id from s), 'A', '시작할까요? 저희 제안서를 함께 살펴보겠습니다.',       'Shall we get started? I''d like to walk you through our proposal.', 3),
  ((select id from s), 'B', '좋습니다. 개요를 검토했고 몇 가지 질문이 있습니다.',   'Sounds great. We''ve reviewed the brief and have a few questions.', 4),
  ((select id from s), 'A', '물론이죠. 편하게 무엇이든 물어보세요.',               'Of course. Please feel free to ask anything.',                    5),
  ((select id from s), 'B', '구현 일정이 어떻게 되나요?',                         'What''s the timeline for implementation?',                        6);

-- Vocabularies for situation 1
with s as (select id from situations where title = '해외 바이어 미팅')
insert into vocabularies (situation_id, word, phonetic, meaning, example_en) values
  ((select id from s), 'in person',      '/ɪn ˈpɜːrsən/',     '직접, 대면으로',    'Let''s meet in person next week.'),
  ((select id from s), 'proposal',       '/prəˈpoʊzəl/',      '제안서, 제안',      'We submitted the proposal yesterday.'),
  ((select id from s), 'implementation', '/ˌɪmplɪmenˈteɪʃən/','구현, 실행',        'The implementation will take 3 months.'),
  ((select id from s), 'timeline',       '/ˈtaɪmlaɪn/',       '일정, 타임라인',    'Can you confirm the timeline?');

-- Expressions for situation 2 (이메일 영어)
with s as (select id from situations where title = '이메일 영어')
insert into expressions (situation_id, role, sentence_ko, sentence_en, sequence) values
  ((select id from s), 'A', '이 이메일이 잘 전달되길 바랍니다.',               'I hope this email finds you well.',                              1),
  ((select id from s), 'B', '연락 주셔서 감사합니다. 요청 사항을 검토했습니다.','Thank you for reaching out. I''ve reviewed your request.',      2),
  ((select id from s), 'A', '이 프로젝트의 마감일을 확인해 주시겠어요?',       'Could you please confirm the deadline for this project?',        3),
  ((select id from s), 'B', '물론이죠. 다음 주 말을 목표로 하고 있습니다.',    'Absolutely. We''re targeting end of next week.',                 4),
  ((select id from s), 'A', '내일까지 상세 일정을 후속으로 전달드리겠습니다.', 'I''ll follow up with a detailed schedule by tomorrow.',          5),
  ((select id from s), 'B', '저희도 괜찮습니다. 기대하겠습니다.',              'That works for us. Looking forward to it.',                      6);

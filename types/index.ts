// ── Database row types (mirrors Supabase schema) ─────────────

export interface Situation {
  id: string
  title: string
  icon: string
  subtitle: string | null
  badge: 'hot' | 'new' | null
  sort_order: number
  created_at: string
}

export interface Expression {
  id: string
  situation_id: string
  role: 'A' | 'B'
  sentence_ko: string
  sentence_en: string
  sequence: number
  created_at: string
}

export interface Vocabulary {
  id: string
  situation_id: string
  word: string
  phonetic: string | null
  meaning: string
  example_en: string | null
  created_at: string
}

export interface UserWord {
  id: string
  user_id: string
  word: string
  meaning: string | null
  phonetic: string | null
  example_en: string | null
  status: 'new' | 'learning' | 'mastered'
  saved_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  situation_id: string
  completed: boolean
  streak_days: number
  last_studied: string | null
}

// ── Free Dictionary API types ─────────────────────────────────

export interface DictionaryEntry {
  word: string
  phonetic?: string
  phonetics: Phonetic[]
  meanings: Meaning[]
  license?: { name: string; url: string }
  sourceUrls?: string[]
}

export interface Phonetic {
  text?: string
  audio?: string
}

export interface Meaning {
  partOfSpeech: string
  definitions: Definition[]
  synonyms: string[]
  antonyms: string[]
}

export interface Definition {
  definition: string
  example?: string
  synonyms?: string[]
  antonyms?: string[]
}

// ── UI / composite types ──────────────────────────────────────

export interface SituationWithContent extends Situation {
  expressions: Expression[]
  vocabularies: Vocabulary[]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface FlashCardWord {
  word: string
  phonetic: string
  meaning: string
  example: string
  source: 'curated' | 'saved' | 'dictionary'
}

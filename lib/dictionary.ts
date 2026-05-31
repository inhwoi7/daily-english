// lib/dictionary.ts
import type { DictionaryEntry, FlashCardWord } from '@/types'

const BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en'

export async function lookupWord(word: string): Promise<DictionaryEntry[] | null> {
  try {
    const res = await fetch(`${BASE}/${encodeURIComponent(word.toLowerCase().trim())}`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export function getAudioUrl(entries: DictionaryEntry[]): string | null {
  for (const entry of entries) {
    for (const p of entry.phonetics) {
      if (p.audio && p.audio.length > 0) return p.audio
    }
  }
  return null
}

export function getPrimaryPhonetic(entries: DictionaryEntry[]): string {
  for (const entry of entries) {
    if (entry.phonetic) return entry.phonetic
    for (const p of entry.phonetics) {
      if (p.text) return p.text
    }
  }
  return ''
}

// ── 카테고리 타입 ─────────────────────────────────────────────
export type WordCategory =
  | 'meeting'     // 회의 & 발표
  | 'call'        // 전화 & 컨퍼런스콜
  | 'research'    // 연구 & 실험
  | 'paper'       // 논문 & 보고서
  | 'discussion'  // 토론 & 질의응답
  | 'email'       // 이메일 & 문서
  | 'polymer'     // 고분자 전문용어
  | 'negotiation' // 협상 & 계약

export interface VocabWord extends FlashCardWord {
  category: WordCategory
  level: 'essential' | 'advanced'
}

// ── 고분자 재료 연구원 맞춤 어휘 120+ ─────────────────────────

export const VOCAB_DB: VocabWord[] = [

  // ══════════════════════════════════════════════
  // 📋 회의 & 발표 (Meeting & Presentation)
  // ══════════════════════════════════════════════
  { category:'meeting', level:'essential', word:'Let me clarify',       phonetic:'/let miː ˈklærɪfaɪ/',      meaning:'명확히 설명할게요',           example:'Let me clarify what I mean by degradation rate.',         source:'curated' },
  { category:'meeting', level:'essential', word:'Could you elaborate',  phonetic:'/kʊd juː ɪˈlæbəreɪt/',    meaning:'더 자세히 설명해 주시겠어요?',  example:'Could you elaborate on the synthesis process?',           source:'curated' },
  { category:'meeting', level:'essential', word:'To summarize',         phonetic:'/tuː ˈsʌməraɪz/',          meaning:'요약하자면',                   example:'To summarize, the tensile strength improved by 30%.',     source:'curated' },
  { category:'meeting', level:'essential', word:'As you can see',       phonetic:'/æz juː kæn siː/',         meaning:'보시다시피',                   example:'As you can see from this graph, Mw increased.',          source:'curated' },
  { category:'meeting', level:'essential', word:'I\'d like to propose', phonetic:'/aɪd laɪk tuː prəˈpoʊz/', meaning:'제안하고 싶습니다',             example:'I\'d like to propose a new approach to crosslinking.',   source:'curated' },
  { category:'meeting', level:'essential', word:'Let\'s move on to',    phonetic:'/lets muːv ɒn tuː/',       meaning:'다음으로 넘어가겠습니다',        example:'Let\'s move on to the characterization results.',        source:'curated' },
  { category:'meeting', level:'essential', word:'Any questions so far', phonetic:'/ˈeni ˈkwestʃənz soʊ fɑːr/', meaning:'여기까지 질문 있으신가요?',  example:'Any questions so far before I continue?',                source:'curated' },
  { category:'meeting', level:'essential', word:'findings',             phonetic:'/ˈfaɪndɪŋz/',              meaning:'결과, 발견',                   example:'Our key findings show improved thermal stability.',       source:'curated' },
  { category:'meeting', level:'essential', word:'action item',          phonetic:'/ˈækʃən ˈaɪtəm/',         meaning:'실행 항목, 할 일',             example:'The action item is to run DSC by Friday.',               source:'curated' },
  { category:'meeting', level:'advanced',  word:'I stand corrected',    phonetic:'/aɪ stænd kəˈrektɪd/',    meaning:'제가 틀렸네요 (인정)',          example:'I stand corrected — the Tg is 180°C, not 160°C.',       source:'curated' },
  { category:'meeting', level:'advanced',  word:'devil\'s advocate',    phonetic:'/ˈdevəlz ˈædvəkət/',      meaning:'반론을 위한 반론',              example:'Let me play devil\'s advocate here.',                    source:'curated' },
  { category:'meeting', level:'advanced',  word:'take that offline',    phonetic:'/teɪk ðæt ˈɒflaɪn/',      meaning:'따로 논의하다',                 example:'Let\'s take that offline and discuss after the meeting.', source:'curated' },
  { category:'meeting', level:'advanced',  word:'circle back',          phonetic:'/ˈsɜːrkəl bæk/',          meaning:'나중에 다시 논의하다',          example:'Let\'s circle back to this after we get more data.',     source:'curated' },
  { category:'meeting', level:'advanced',  word:'low-hanging fruit',    phonetic:'/loʊ hæŋɪŋ fruːt/',       meaning:'쉽게 달성 가능한 것',          example:'The coating optimization is low-hanging fruit.',         source:'curated' },

  // ══════════════════════════════════════════════
  // 📞 전화 & 컨퍼런스콜 (Phone & Conference Call)
  // ══════════════════════════════════════════════
  { category:'call', level:'essential', word:'Can you hear me clearly',  phonetic:'/kæn juː hɪər miː ˈklɪərli/', meaning:'잘 들리시나요?',           example:'Can you hear me clearly? The line seems noisy.',         source:'curated' },
  { category:'call', level:'essential', word:'You\'re breaking up',      phonetic:'/jʊər ˈbreɪkɪŋ ʌp/',         meaning:'소리가 끊기네요',           example:'Sorry, you\'re breaking up. Can you repeat that?',       source:'curated' },
  { category:'call', level:'essential', word:'I\'ll put you on hold',    phonetic:'/aɪl pʊt juː ɒn hoʊld/',     meaning:'잠깐 기다려 주세요',         example:'I\'ll put you on hold for a minute.',                    source:'curated' },
  { category:'call', level:'essential', word:'Let me loop in',           phonetic:'/let miː luːp ɪn/',           meaning:'~를 참여시키다',            example:'Let me loop in our lab manager on this call.',           source:'curated' },
  { category:'call', level:'essential', word:'dial in',                  phonetic:'/daɪəl ɪn/',                  meaning:'전화로 참여하다',           example:'Please dial in 5 minutes before the call starts.',       source:'curated' },
  { category:'call', level:'essential', word:'drop off the call',        phonetic:'/drɒp ɒf ðə kɔːl/',          meaning:'통화에서 끊기다',           example:'Sorry, I dropped off the call for a moment.',            source:'curated' },
  { category:'call', level:'essential', word:'I\'ll follow up',          phonetic:'/aɪl ˈfɒloʊ ʌp/',            meaning:'후속 조치하겠습니다',        example:'I\'ll follow up with the test results by email.',        source:'curated' },
  { category:'call', level:'essential', word:'touch base',               phonetic:'/tʌtʃ beɪs/',                 meaning:'짧게 연락하다',             example:'Let\'s touch base tomorrow morning.',                    source:'curated' },
  { category:'call', level:'advanced',  word:'mute yourself',            phonetic:'/mjuːt jɔːrself/',            meaning:'음소거 하세요',             example:'Could everyone mute themselves when not speaking?',      source:'curated' },
  { category:'call', level:'advanced',  word:'bandwidth',                phonetic:'/ˈbændwɪdθ/',                 meaning:'여유 시간/역량',            example:'I don\'t have the bandwidth for that this week.',        source:'curated' },

  // ══════════════════════════════════════════════
  // 🔬 연구 & 실험 (Research & Experiment)
  // ══════════════════════════════════════════════
  { category:'research', level:'essential', word:'reproducible',          phonetic:'/ˌriːprəˈdjuːsɪbəl/',     meaning:'재현 가능한',               example:'The results need to be reproducible across batches.',    source:'curated' },
  { category:'research', level:'essential', word:'characterization',       phonetic:'/ˌkærɪktəraɪˈzeɪʃən/',   meaning:'특성 분석',                 example:'We performed full characterization of the sample.',      source:'curated' },
  { category:'research', level:'essential', word:'yield',                  phonetic:'/jiːld/',                  meaning:'수율, 수확량',              example:'The synthesis yield was 85% after purification.',        source:'curated' },
  { category:'research', level:'essential', word:'baseline',               phonetic:'/ˈbeɪslaɪn/',             meaning:'기준값, 베이스라인',         example:'We need to establish a baseline before testing.',        source:'curated' },
  { category:'research', level:'essential', word:'benchmark',              phonetic:'/ˈbentʃmɑːrk/',           meaning:'비교 기준',                 example:'This material sets a new benchmark for flexibility.',    source:'curated' },
  { category:'research', level:'essential', word:'scale up',               phonetic:'/skeɪl ʌp/',              meaning:'규모를 키우다',              example:'We need to scale up production to 100kg batches.',       source:'curated' },
  { category:'research', level:'essential', word:'run a test',             phonetic:'/rʌn ə test/',            meaning:'시험을 실시하다',            example:'Let\'s run a test with different initiator concentrations.', source:'curated' },
  { category:'research', level:'essential', word:'replicate',              phonetic:'/ˈreplɪkeɪt/',            meaning:'반복 실험하다',              example:'We replicated the experiment three times.',              source:'curated' },
  { category:'research', level:'essential', word:'anomaly',                phonetic:'/əˈnɒməli/',              meaning:'이상값, 변칙',              example:'There\'s an anomaly in the viscosity data.',             source:'curated' },
  { category:'research', level:'essential', word:'troubleshoot',           phonetic:'/ˈtrʌbəlʃuːt/',          meaning:'문제를 해결하다',            example:'We need to troubleshoot the reactor temperature issue.',  source:'curated' },
  { category:'research', level:'advanced',  word:'proof of concept',       phonetic:'/pruːf əv ˈkɒnsept/',     meaning:'개념 증명',                 example:'This is just a proof of concept at this stage.',         source:'curated' },
  { category:'research', level:'advanced',  word:'scalable',               phonetic:'/ˈskeɪləbəl/',            meaning:'확장 가능한',               example:'Is this process scalable to industrial levels?',         source:'curated' },
  { category:'research', level:'advanced',  word:'bottleneck',             phonetic:'/ˈbɒtəlnek/',             meaning:'병목, 걸림돌',              example:'Purification is our biggest bottleneck right now.',      source:'curated' },

  // ══════════════════════════════════════════════
  // 📄 논문 & 보고서 (Paper & Report)
  // ══════════════════════════════════════════════
  { category:'paper', level:'essential', word:'novel approach',           phonetic:'/ˈnɒvəl əˈproʊtʃ/',       meaning:'새로운 접근법',             example:'We present a novel approach to polymer blending.',       source:'curated' },
  { category:'paper', level:'essential', word:'in accordance with',       phonetic:'/ɪn əˈkɔːrdəns wɪð/',     meaning:'~에 따라',                  example:'Results are in accordance with previous studies.',       source:'curated' },
  { category:'paper', level:'essential', word:'it is worth noting',       phonetic:'/ɪt ɪz wɜːrθ ˈnoʊtɪŋ/',  meaning:'주목할 점은',               example:'It is worth noting that the Tg shifted by 20°C.',       source:'curated' },
  { category:'paper', level:'essential', word:'furthermore',              phonetic:'/ˈfɜːrðərmɔːr/',          meaning:'더욱이, 게다가',            example:'Furthermore, the tensile strength increased by 40%.',   source:'curated' },
  { category:'paper', level:'essential', word:'nonetheless',              phonetic:'/ˌnʌnðəˈles/',            meaning:'그럼에도 불구하고',          example:'Nonetheless, the results are statistically significant.', source:'curated' },
  { category:'paper', level:'essential', word:'as evidenced by',          phonetic:'/æz ˈevɪdənst baɪ/',      meaning:'~에서 알 수 있듯',          example:'As evidenced by the XRD data, crystallinity increased.', source:'curated' },
  { category:'paper', level:'essential', word:'correlate with',           phonetic:'/ˈkɒrəleɪt wɪð/',         meaning:'~와 상관관계가 있다',        example:'The Mw correlates with the mechanical strength.',        source:'curated' },
  { category:'paper', level:'essential', word:'significant',              phonetic:'/sɪɡˈnɪfɪkənt/',          meaning:'유의미한, 중요한',           example:'The difference is statistically significant (p<0.05).', source:'curated' },
  { category:'paper', level:'advanced',  word:'to the best of our knowledge', phonetic:'/tuː ðə best əv aʊər ˈnɒlɪdʒ/', meaning:'우리가 아는 한',  example:'To the best of our knowledge, this is the first report.', source:'curated' },
  { category:'paper', level:'advanced',  word:'pave the way for',         phonetic:'/peɪv ðə weɪ fɔːr/',      meaning:'~의 길을 열다',             example:'This work paves the way for biodegradable packaging.',   source:'curated' },

  // ══════════════════════════════════════════════
  // ❓ 토론 & 질의응답 (Discussion & Q&A)
  // ══════════════════════════════════════════════
  { category:'discussion', level:'essential', word:'I\'m not following',      phonetic:'/aɪm nɒt ˈfɒloʊɪŋ/',     meaning:'잘 이해가 안 됩니다',      example:'I\'m not following — could you slow down a bit?',       source:'curated' },
  { category:'discussion', level:'essential', word:'What do you mean by',     phonetic:'/wɒt duː juː miːn baɪ/', meaning:'~가 무슨 뜻인가요?',       example:'What do you mean by "phase separation" here?',          source:'curated' },
  { category:'discussion', level:'essential', word:'Could you repeat that',   phonetic:'/kʊd juː rɪˈpiːt ðæt/', meaning:'다시 말씀해 주시겠어요?',   example:'Could you repeat that? I missed the last part.',        source:'curated' },
  { category:'discussion', level:'essential', word:'That\'s a good point',    phonetic:'/ðæts ə ɡʊd pɔɪnt/',    meaning:'좋은 지적이에요',           example:'That\'s a good point about the crosslink density.',     source:'curated' },
  { category:'discussion', level:'essential', word:'I see your point',        phonetic:'/aɪ siː jɔːr pɔɪnt/',   meaning:'무슨 말씀인지 알겠어요',    example:'I see your point, but our data suggests otherwise.',    source:'curated' },
  { category:'discussion', level:'essential', word:'with all due respect',    phonetic:'/wɪð ɔːl djuː rɪˈspekt/', meaning:'실례지만 (반론 시)',      example:'With all due respect, I think the mechanism differs.',  source:'curated' },
  { category:'discussion', level:'essential', word:'in my experience',        phonetic:'/ɪn maɪ ɪkˈspɪəriəns/', meaning:'제 경험상',                example:'In my experience, cure temperature matters more.',      source:'curated' },
  { category:'discussion', level:'essential', word:'hypothetically speaking', phonetic:'/ˌhaɪpəˈθetɪkli ˈspiːkɪŋ/', meaning:'가정의 이야기이지만',  example:'Hypothetically speaking, what if we changed the ratio?', source:'curated' },
  { category:'discussion', level:'advanced',  word:'I beg to differ',         phonetic:'/aɪ beɡ tuː ˈdɪfər/',   meaning:'저는 다르게 생각합니다',    example:'I beg to differ — the literature shows the opposite.',  source:'curated' },
  { category:'discussion', level:'advanced',  word:'food for thought',         phonetic:'/fuːd fɔːr θɔːt/',      meaning:'생각해볼 거리',             example:'That\'s food for thought for our next experiment.',     source:'curated' },

  // ══════════════════════════════════════════════
  // 📧 이메일 & 협업 (Email & Collaboration)
  // ══════════════════════════════════════════════
  { category:'email', level:'essential', word:'Please find attached',      phonetic:'/pliːz faɪnd əˈtætʃt/',   meaning:'첨부 파일을 확인해주세요',   example:'Please find attached the characterization report.',     source:'curated' },
  { category:'email', level:'essential', word:'As discussed',              phonetic:'/æz dɪˈskʌst/',           meaning:'논의한 바와 같이',           example:'As discussed, I\'m sending the sample data.',           source:'curated' },
  { category:'email', level:'essential', word:'I wanted to follow up on',  phonetic:'/aɪ ˈwɒntɪd tuː ˈfɒloʊ ʌp ɒn/', meaning:'~에 대해 후속 연락드립니다', example:'I wanted to follow up on last week\'s results.',  source:'curated' },
  { category:'email', level:'essential', word:'Could you please confirm',  phonetic:'/kʊd juː pliːz kənˈfɜːrm/', meaning:'확인해 주시겠어요?',       example:'Could you please confirm the meeting time?',           source:'curated' },
  { category:'email', level:'essential', word:'I\'ll keep you posted',     phonetic:'/aɪl kiːp juː ˈpoʊstɪd/', meaning:'계속 알려드리겠습니다',      example:'I\'ll keep you posted on the test results.',           source:'curated' },
  { category:'email', level:'essential', word:'at your earliest convenience', phonetic:'/æt jɔːr ˈɜːrliɪst kənˈviːniəns/', meaning:'가능한 빨리',   example:'Please reply at your earliest convenience.',           source:'curated' },
  { category:'email', level:'essential', word:'FYI',                       phonetic:'/ɛf waɪ aɪ/',             meaning:'참고로',                    example:'FYI, the supplier changed the delivery date.',          source:'curated' },
  { category:'email', level:'advanced',  word:'per my previous email',     phonetic:'/pɜːr maɪ ˈpriːviəs ˈiːmeɪl/', meaning:'제 이전 이메일에서',   example:'Per my previous email, the deadline is Friday.',       source:'curated' },

  // ══════════════════════════════════════════════
  // 🧪 고분자 전문 용어 (Polymer Science Terms)
  // ══════════════════════════════════════════════
  { category:'polymer', level:'essential', word:'molecular weight',        phonetic:'/məˈlekjʊlər weɪt/',      meaning:'분자량',                    example:'The number-average molecular weight is 50,000 g/mol.',  source:'curated' },
  { category:'polymer', level:'essential', word:'glass transition',        phonetic:'/ɡlɑːs trænˈzɪʃən/',     meaning:'유리 전이 (온도)',           example:'The glass transition temperature is 120°C.',            source:'curated' },
  { category:'polymer', level:'essential', word:'crosslinking',            phonetic:'/ˈkrɒslɪŋkɪŋ/',          meaning:'가교 결합',                 example:'Crosslinking improves thermal resistance significantly.', source:'curated' },
  { category:'polymer', level:'essential', word:'tensile strength',        phonetic:'/ˈtensaɪl streŋθ/',       meaning:'인장 강도',                 example:'The tensile strength increased by 25% after annealing.', source:'curated' },
  { category:'polymer', level:'essential', word:'thermal stability',       phonetic:'/ˈθɜːrməl stəˈbɪlɪti/',  meaning:'열 안정성',                 example:'We measured thermal stability using TGA.',              source:'curated' },
  { category:'polymer', level:'essential', word:'viscosity',               phonetic:'/vɪˈskɒsɪti/',            meaning:'점도',                      example:'The viscosity increased with higher polymer concentration.', source:'curated' },
  { category:'polymer', level:'essential', word:'crystallinity',           phonetic:'/ˌkrɪstəˈlɪnɪti/',       meaning:'결정성',                    example:'XRD confirmed 60% crystallinity in the sample.',        source:'curated' },
  { category:'polymer', level:'essential', word:'degradation',             phonetic:'/ˌdeɡrəˈdeɪʃən/',        meaning:'분해, 열화',                example:'UV exposure accelerates degradation of the film.',      source:'curated' },
  { category:'polymer', level:'essential', word:'polymerization',          phonetic:'/pəˌlɪməraɪˈzeɪʃən/',    meaning:'중합 반응',                 example:'Free radical polymerization was used for synthesis.',   source:'curated' },
  { category:'polymer', level:'essential', word:'monomer',                 phonetic:'/ˈmɒnəmər/',              meaning:'단량체',                    example:'The monomer was purified before polymerization.',       source:'curated' },
  { category:'polymer', level:'essential', word:'copolymer',               phonetic:'/koʊˈpɒlɪmər/',           meaning:'공중합체',                  example:'We synthesized a block copolymer of PLA and PEG.',     source:'curated' },
  { category:'polymer', level:'essential', word:'rheology',                phonetic:'/riˈɒlədʒi/',             meaning:'유변학 (흐름/변형 연구)',    example:'Rheology measurements confirmed gel-like behavior.',    source:'curated' },
  { category:'polymer', level:'advanced',  word:'dispersity',              phonetic:'/dɪˈspɜːrsɪti/',          meaning:'분산도 (Ð)',                example:'The dispersity was narrow at 1.15.',                    source:'curated' },
  { category:'polymer', level:'advanced',  word:'chain transfer agent',    phonetic:'/tʃeɪn ˈtrænsfɜːr ˈeɪdʒənt/', meaning:'연쇄 이동제',         example:'We added a chain transfer agent to control Mw.',       source:'curated' },
  { category:'polymer', level:'advanced',  word:'entanglement',            phonetic:'/ɪnˈtæŋɡəlmənt/',         meaning:'사슬 얽힘',                 example:'Chain entanglement affects melt viscosity strongly.',   source:'curated' },

  // ══════════════════════════════════════════════
  // 🤝 협상 & 비즈니스 (Negotiation & Business)
  // ══════════════════════════════════════════════
  { category:'negotiation', level:'essential', word:'We\'d like to propose',   phonetic:'/wiːd laɪk tuː prəˈpoʊz/', meaning:'제안하고 싶습니다',     example:'We\'d like to propose a joint development agreement.',  source:'curated' },
  { category:'negotiation', level:'essential', word:'That\'s non-negotiable',  phonetic:'/ðæts nɒn nɪˈɡoʊʃɪəbəl/', meaning:'협상 불가입니다',      example:'The IP ownership terms are non-negotiable.',           source:'curated' },
  { category:'negotiation', level:'essential', word:'We can work with that',   phonetic:'/wiː kæn wɜːrk wɪð ðæt/', meaning:'그 조건으로 할 수 있어요', example:'A 45-day lead time? We can work with that.',          source:'curated' },
  { category:'negotiation', level:'essential', word:'ballpark figure',         phonetic:'/ˈbɔːlpɑːrk ˈfɪɡər/',     meaning:'대략적인 금액',          example:'Can you give me a ballpark figure for licensing fees?', source:'curated' },
  { category:'negotiation', level:'essential', word:'due diligence',           phonetic:'/djuː ˈdɪlɪdʒəns/',       meaning:'실사, 철저한 검토',       example:'We need to complete due diligence before signing.',    source:'curated' },
  { category:'negotiation', level:'advanced',  word:'win-win',                 phonetic:'/wɪn wɪn/',               meaning:'서로 이득인',             example:'This partnership should be win-win for both sides.',   source:'curated' },
  { category:'negotiation', level:'advanced',  word:'leverage',                phonetic:'/ˈlevərɪdʒ/',             meaning:'활용하다, 레버리지',       example:'We can leverage our patent portfolio in negotiations.',  source:'curated' },
]

// 카테고리별 필터
export function getByCategory(cat: WordCategory) {
  return VOCAB_DB.filter(w => w.category === cat)
}

// 레벨별 필터
export function getByLevel(level: 'essential' | 'advanced') {
  return VOCAB_DB.filter(w => w.level === level)
}

// 오늘의 단어 (날짜 기반)
export function getTodayWord() {
  const day = new Date().getDate()
  return VOCAB_DB[day % VOCAB_DB.length]
}

// 카테고리 라벨
export const CATEGORY_LABELS: Record<WordCategory, { label: string; icon: string }> = {
  meeting:     { label: '회의 & 발표',      icon: '📋' },
  call:        { label: '전화 & 컨퍼런스콜', icon: '📞' },
  research:    { label: '연구 & 실험',      icon: '🔬' },
  paper:       { label: '논문 & 보고서',    icon: '📄' },
  discussion:  { label: '토론 & Q&A',      icon: '❓' },
  email:       { label: '이메일 & 협업',    icon: '📧' },
  polymer:     { label: '고분자 전문용어',   icon: '🧪' },
  negotiation: { label: '협상 & 비즈니스',  icon: '🤝' },
}

// 하위 호환성 유지
export const BUSINESS_VOCAB = VOCAB_DB

// ── 추가 단어 (APPEND) ────────────────────────────────────────
// 아래 내용을 VOCAB_DB 배열 마지막 ] 전에 추가하세요
// 실제 파일에서는 별도 배열로 export 후 합치는 방식 사용

export const EXTRA_VOCAB: VocabWord[] = [

  // ══════════════════════════════════════════════
  // 📋 회의 & 발표 추가
  // ══════════════════════════════════════════════
  { category:'meeting', level:'essential', word:'I\'d like to add',         phonetic:'/aɪd laɪk tuː æd/',           meaning:'추가로 말씀드리고 싶은데요',   example:'I\'d like to add one more data point here.',             source:'curated' },
  { category:'meeting', level:'essential', word:'To put it simply',         phonetic:'/tuː pʊt ɪt ˈsɪmpli/',        meaning:'쉽게 말하면',                  example:'To put it simply, the polymer degrades faster at 80°C.', source:'curated' },
  { category:'meeting', level:'essential', word:'walk me through',          phonetic:'/wɔːk miː θruː/',              meaning:'설명해 주세요',                example:'Can you walk me through the experimental setup?',        source:'curated' },
  { category:'meeting', level:'essential', word:'on the same page',         phonetic:'/ɒn ðə seɪm peɪdʒ/',          meaning:'같은 이해를 공유하다',          example:'Are we all on the same page about the deadline?',        source:'curated' },
  { category:'meeting', level:'essential', word:'wrap up',                  phonetic:'/ræp ʌp/',                     meaning:'마무리하다',                   example:'Let\'s wrap up with the key takeaways.',                 source:'curated' },
  { category:'meeting', level:'essential', word:'going forward',            phonetic:'/ˈɡoʊɪŋ ˈfɔːrwərd/',          meaning:'앞으로는, 향후에는',            example:'Going forward, we\'ll run triplicates for all tests.',   source:'curated' },
  { category:'meeting', level:'essential', word:'bring to the table',       phonetic:'/brɪŋ tuː ðə ˈteɪbəl/',       meaning:'기여하다, 제시하다',            example:'What can we bring to the table in this collaboration?',  source:'curated' },
  { category:'meeting', level:'essential', word:'heads up',                 phonetic:'/hedz ʌp/',                    meaning:'미리 알려드립니다',             example:'Just a heads up — the supplier changed the specs.',      source:'curated' },
  { category:'meeting', level:'advanced',  word:'nitpick',                  phonetic:'/ˈnɪtpɪk/',                   meaning:'사소한 것에 트집 잡다',         example:'I don\'t want to nitpick, but the units are wrong.',     source:'curated' },
  { category:'meeting', level:'advanced',  word:'elephant in the room',     phonetic:'/ˈelɪfənt ɪn ðə ruːm/',       meaning:'모두가 알지만 말 안 하는 것',   example:'The elephant in the room is our timeline slippage.',     source:'curated' },
  { category:'meeting', level:'advanced',  word:'paradigm shift',           phonetic:'/ˈpærədaɪm ʃɪft/',            meaning:'패러다임 전환',                example:'This material represents a paradigm shift in packaging.', source:'curated' },

  // ══════════════════════════════════════════════
  // 📞 전화 & 컨퍼런스콜 추가
  // ══════════════════════════════════════════════
  { category:'call', level:'essential', word:'Could you speak up',          phonetic:'/kʊd juː spiːk ʌp/',          meaning:'좀 더 크게 말씀해 주시겠어요?', example:'Could you speak up? You\'re a bit quiet.',               source:'curated' },
  { category:'call', level:'essential', word:'Let me check my calendar',    phonetic:'/let miː tʃek maɪ ˈkælɪndər/', meaning:'일정을 확인해 볼게요',         example:'Let me check my calendar and get back to you.',          source:'curated' },
  { category:'call', level:'essential', word:'I\'ll send you a summary',    phonetic:'/aɪl send juː ə ˈsʌməri/',    meaning:'요약본을 보내드릴게요',         example:'I\'ll send you a summary of what we discussed.',         source:'curated' },
  { category:'call', level:'essential', word:'agenda',                      phonetic:'/əˈdʒendə/',                   meaning:'안건, 회의 목록',              example:'Did everyone receive the agenda for today\'s call?',     source:'curated' },
  { category:'call', level:'essential', word:'stand-up',                    phonetic:'/stænd ʌp/',                   meaning:'짧은 일일 회의',               example:'We have a 15-minute stand-up every morning.',            source:'curated' },
  { category:'call', level:'essential', word:'debrief',                     phonetic:'/diːˈbriːf/',                  meaning:'결과 보고, 사후 회의',          example:'Let\'s debrief after the client call.',                  source:'curated' },
  { category:'call', level:'advanced',  word:'synchronous',                 phonetic:'/ˈsɪŋkrənəs/',                meaning:'실시간의, 동기식의',            example:'Do we need a synchronous meeting or can we do async?',   source:'curated' },
  { category:'call', level:'advanced',  word:'action points',               phonetic:'/ˈækʃən pɔɪnts/',             meaning:'실행 과제 목록',               example:'Let me recap the action points from today\'s call.',     source:'curated' },

  // ══════════════════════════════════════════════
  // 🔬 연구 & 실험 추가
  // ══════════════════════════════════════════════
  { category:'research', level:'essential', word:'hypothesis',               phonetic:'/haɪˈpɒθɪsɪs/',              meaning:'가설',                        example:'Our hypothesis is that Tg increases with crosslink density.', source:'curated' },
  { category:'research', level:'essential', word:'variable',                 phonetic:'/ˈveəriəbəl/',               meaning:'변수',                        example:'We kept all variables constant except temperature.',      source:'curated' },
  { category:'research', level:'essential', word:'control group',            phonetic:'/kənˈtroʊl ɡruːp/',          meaning:'대조군',                      example:'The control group used no initiator.',                   source:'curated' },
  { category:'research', level:'essential', word:'iteration',                phonetic:'/ˌɪtəˈreɪʃən/',              meaning:'반복, 시도',                  example:'After three iterations, we optimized the formulation.',  source:'curated' },
  { category:'research', level:'essential', word:'run into issues',          phonetic:'/rʌn ˈɪntuː ˈɪʃuːz/',        meaning:'문제에 부딪히다',              example:'We ran into issues with phase separation.',              source:'curated' },
  { category:'research', level:'essential', word:'rule out',                 phonetic:'/ruːl aʊt/',                  meaning:'배제하다',                    example:'We can rule out contamination as a cause.',              source:'curated' },
  { category:'research', level:'essential', word:'narrow down',              phonetic:'/ˈnæroʊ daʊn/',              meaning:'범위를 좁히다',               example:'Let\'s narrow down the candidates to three.',            source:'curated' },
  { category:'research', level:'essential', word:'due to',                   phonetic:'/djuː tuː/',                  meaning:'~때문에',                    example:'The increase is due to stronger intermolecular forces.',  source:'curated' },
  { category:'research', level:'essential', word:'attributed to',            phonetic:'/əˈtrɪbjuːtɪd tuː/',         meaning:'~에 기인한',                  example:'The improvement is attributed to the crosslinking agent.', source:'curated' },
  { category:'research', level:'essential', word:'consistent with',          phonetic:'/kənˈsɪstənt wɪð/',          meaning:'~와 일치하다',                example:'These results are consistent with our previous data.',    source:'curated' },
  { category:'research', level:'advanced',  word:'statistically significant', phonetic:'/stəˈtɪstɪkli sɪɡˈnɪfɪkənt/', meaning:'통계적으로 유의미한',       example:'The difference is statistically significant (p<0.05).',  source:'curated' },
  { category:'research', level:'advanced',  word:'confounding factor',       phonetic:'/kənˈfaʊndɪŋ ˈfæktər/',      meaning:'교란 변수',                   example:'Humidity is a confounding factor in our experiment.',    source:'curated' },
  { category:'research', level:'advanced',  word:'correlation',              phonetic:'/ˌkɒrəˈleɪʃən/',             meaning:'상관관계',                    example:'There\'s a strong correlation between Mw and viscosity.', source:'curated' },

  // ══════════════════════════════════════════════
  // 📄 논문 & 보고서 추가
  // ══════════════════════════════════════════════
  { category:'paper', level:'essential', word:'state of the art',           phonetic:'/steɪt əv ðə ɑːrt/',          meaning:'최신 기술, 현재 수준',        example:'This outperforms current state-of-the-art materials.',   source:'curated' },
  { category:'paper', level:'essential', word:'in contrast',                phonetic:'/ɪn ˈkɒntrɑːst/',            meaning:'대조적으로',                  example:'In contrast, sample B showed lower thermal stability.',   source:'curated' },
  { category:'paper', level:'essential', word:'it is hypothesized',         phonetic:'/ɪt ɪz haɪˈpɒθɪsaɪzd/',     meaning:'가설을 세우면',               example:'It is hypothesized that the Tg shift is due to plasticization.', source:'curated' },
  { category:'paper', level:'essential', word:'preliminary results',        phonetic:'/prɪˈlɪmɪnəri rɪˈzʌlts/',   meaning:'예비 결과',                   example:'Preliminary results are promising.',                     source:'curated' },
  { category:'paper', level:'essential', word:'this is consistent with',    phonetic:'/ðɪs ɪz kənˈsɪstənt wɪð/',  meaning:'이는 ~와 일치합니다',         example:'This is consistent with previously reported values.',    source:'curated' },
  { category:'paper', level:'essential', word:'beyond the scope',           phonetic:'/bɪˈɒnd ðə skoʊp/',          meaning:'범위를 벗어난',               example:'This is beyond the scope of the current study.',         source:'curated' },
  { category:'paper', level:'essential', word:'warrant further study',      phonetic:'/ˈwɒrənt ˈfɜːrðər ˈstʌdi/', meaning:'추가 연구가 필요하다',        example:'This mechanism warrants further study.',                 source:'curated' },
  { category:'paper', level:'advanced',  word:'in lieu of',                 phonetic:'/ɪn ljuː əv/',               meaning:'~대신에',                    example:'In lieu of DSC, we used DMA for thermal analysis.',      source:'curated' },
  { category:'paper', level:'advanced',  word:'albeit',                     phonetic:'/ɔːlˈbiːɪt/',                meaning:'비록 ~이지만',               example:'The results are promising, albeit preliminary.',         source:'curated' },
  { category:'paper', level:'advanced',  word:'hitherto',                   phonetic:'/ˌhɪðəˈtuː/',                meaning:'지금까지는',                  example:'This phenomenon has hitherto been unexplored.',          source:'curated' },

  // ══════════════════════════════════════════════
  // ❓ 토론 & Q&A 추가
  // ══════════════════════════════════════════════
  { category:'discussion', level:'essential', word:'Could you expand on',    phonetic:'/kʊd juː ɪkˈspænd ɒn/',     meaning:'더 자세히 설명해 주시겠어요?', example:'Could you expand on the mechanism you proposed?',        source:'curated' },
  { category:'discussion', level:'essential', word:'That\'s an interesting point', phonetic:'/ðæts ən ˈɪntrɪstɪŋ pɔɪnt/', meaning:'흥미로운 지적이에요',   example:'That\'s an interesting point about the catalyst role.',  source:'curated' },
  { category:'discussion', level:'essential', word:'If I understand correctly', phonetic:'/ɪf aɪ ˌʌndəˈstænd kəˈrektli/', meaning:'제가 제대로 이해했다면', example:'If I understand correctly, the Tg shifts due to plasticization?', source:'curated' },
  { category:'discussion', level:'essential', word:'off the top of my head',  phonetic:'/ɒf ðə tɒp əv maɪ hed/',    meaning:'즉석에서 말하자면',           example:'Off the top of my head, I\'d say around 150°C.',        source:'curated' },
  { category:'discussion', level:'essential', word:'let me get back to you',  phonetic:'/let miː ɡet bæk tuː juː/', meaning:'나중에 답변드릴게요',         example:'That\'s a good question — let me get back to you.',     source:'curated' },
  { category:'discussion', level:'essential', word:'fair enough',             phonetic:'/feər ɪˈnʌf/',               meaning:'맞는 말이에요, 납득됩니다',   example:'Fair enough — we should run more replicates.',           source:'curated' },
  { category:'discussion', level:'essential', word:'have a point',            phonetic:'/hæv ə pɔɪnt/',              meaning:'일리가 있다',                example:'You have a point — the cure time might matter here.',    source:'curated' },
  { category:'discussion', level:'advanced',  word:'I\'d push back on that',  phonetic:'/aɪd pʊʃ bæk ɒn ðæt/',      meaning:'그 부분은 동의하기 어렵습니다', example:'I\'d push back on that — our data shows otherwise.',   source:'curated' },
  { category:'discussion', level:'advanced',  word:'nuanced',                 phonetic:'/ˈnjuːɑːnst/',               meaning:'미묘한 차이가 있는',          example:'The answer is more nuanced than a simple yes or no.',   source:'curated' },

  // ══════════════════════════════════════════════
  // 📧 이메일 & 협업 추가
  // ══════════════════════════════════════════════
  { category:'email', level:'essential', word:'Hope this helps',            phonetic:'/hoʊp ðɪs helps/',            meaning:'도움이 되길 바랍니다',        example:'Hope this helps. Let me know if you need more info.',   source:'curated' },
  { category:'email', level:'essential', word:'please advise',              phonetic:'/pliːz ədˈvaɪz/',             meaning:'의견/지시 부탁드립니다',       example:'Please advise on how to proceed.',                       source:'curated' },
  { category:'email', level:'essential', word:'as requested',               phonetic:'/æz rɪˈkwestɪd/',            meaning:'요청하신 대로',               example:'As requested, I\'ve attached the full report.',          source:'curated' },
  { category:'email', level:'essential', word:'in the meantime',            phonetic:'/ɪn ðə ˈmiːntaɪm/',          meaning:'그 동안에',                   example:'In the meantime, please review the draft.',             source:'curated' },
  { category:'email', level:'essential', word:'feel free to reach out',     phonetic:'/fiːl friː tuː riːtʃ aʊt/',  meaning:'편하게 연락주세요',            example:'Feel free to reach out if you have any questions.',     source:'curated' },
  { category:'email', level:'essential', word:'I appreciate your patience', phonetic:'/aɪ əˈpriːʃieɪt jɔːr ˈpeɪʃəns/', meaning:'기다려 주셔서 감사합니다', example:'I appreciate your patience while we investigate.',      source:'curated' },
  { category:'email', level:'advanced',  word:'caveat',                     phonetic:'/ˈkæviæt/',                   meaning:'주의사항, 단서',              example:'One caveat — these results are still preliminary.',     source:'curated' },
  { category:'email', level:'advanced',  word:'touch base offline',         phonetic:'/tʌtʃ beɪs ˈɒflaɪn/',        meaning:'따로 연락해서 논의하다',       example:'Let\'s touch base offline about the budget.',           source:'curated' },

  // ══════════════════════════════════════════════
  // 🧪 고분자 전문용어 추가
  // ══════════════════════════════════════════════
  { category:'polymer', level:'essential', word:'cure',                     phonetic:'/kjʊər/',                     meaning:'경화 (반응)',                 example:'The epoxy requires 24 hours to fully cure.',            source:'curated' },
  { category:'polymer', level:'essential', word:'aging',                    phonetic:'/ˈeɪdʒɪŋ/',                   meaning:'노화, 열화',                 example:'Thermal aging tests were conducted at 120°C.',          source:'curated' },
  { category:'polymer', level:'essential', word:'filler',                   phonetic:'/ˈfɪlər/',                    meaning:'충전재',                     example:'Carbon black is commonly used as a filler.',            source:'curated' },
  { category:'polymer', level:'essential', word:'matrix',                   phonetic:'/ˈmeɪtrɪks/',                 meaning:'매트릭스, 기지 재료',         example:'The polymer matrix determines the composite properties.', source:'curated' },
  { category:'polymer', level:'essential', word:'composite',                phonetic:'/ˈkɒmpəzɪt/',                meaning:'복합재료',                   example:'The composite showed 3x higher stiffness.',             source:'curated' },
  { category:'polymer', level:'essential', word:'blend',                    phonetic:'/blend/',                     meaning:'블렌드, 혼합물',              example:'The PLA/PBAT blend improved flexibility.',              source:'curated' },
  { category:'polymer', level:'essential', word:'elongation at break',      phonetic:'/ɪˌlɒŋˈɡeɪʃən æt breɪk/',   meaning:'파단 신율',                  example:'Elongation at break increased from 50% to 200%.',       source:'curated' },
  { category:'polymer', level:'essential', word:'modulus',                  phonetic:'/ˈmɒdjʊləs/',                meaning:'탄성률',                     example:'Young\'s modulus decreased after plasticizer addition.', source:'curated' },
  { category:'polymer', level:'essential', word:'initiator',                phonetic:'/ɪˈnɪʃɪeɪtər/',              meaning:'개시제',                     example:'AIBN was used as the radical initiator.',               source:'curated' },
  { category:'polymer', level:'essential', word:'catalyst',                 phonetic:'/ˈkætəlɪst/',                meaning:'촉매',                       example:'The Ziegler-Natta catalyst controls stereoregularity.', source:'curated' },
  { category:'polymer', level:'essential', word:'stoichiometry',            phonetic:'/ˌstɔɪkiˈɒmɪtri/',           meaning:'화학양론',                   example:'Check the stoichiometry of your monomer ratio.',        source:'curated' },
  { category:'polymer', level:'essential', word:'annealing',                phonetic:'/əˈniːlɪŋ/',                  meaning:'어닐링, 열처리',              example:'Annealing at 80°C improved crystallinity significantly.', source:'curated' },
  { category:'polymer', level:'essential', word:'miscibility',              phonetic:'/ˌmɪsɪˈbɪlɪti/',             meaning:'상용성, 혼화성',              example:'PLA and PHA show limited miscibility.',                 source:'curated' },
  { category:'polymer', level:'advanced',  word:'free volume',              phonetic:'/friː ˈvɒljuːm/',             meaning:'자유 부피',                  example:'Increased free volume lowers the Tg.',                  source:'curated' },
  { category:'polymer', level:'advanced',  word:'reptation',                phonetic:'/repˈteɪʃən/',                meaning:'파충류 운동 (사슬 이동 모델)', example:'Reptation theory describes polymer chain diffusion.',    source:'curated' },
  { category:'polymer', level:'advanced',  word:'semicrystalline',          phonetic:'/ˌsemiˈkrɪstəlaɪn/',         meaning:'반결정성의',                  example:'PET is a semicrystalline polymer.',                     source:'curated' },
  { category:'polymer', level:'advanced',  word:'tacticity',                phonetic:'/tækˈtɪsɪti/',               meaning:'입체규칙성',                  example:'Isotactic PP has higher crystallinity than atactic PP.', source:'curated' },

  // ══════════════════════════════════════════════
  // 🤝 협상 & 비즈니스 추가
  // ══════════════════════════════════════════════
  { category:'negotiation', level:'essential', word:'let\'s meet halfway',  phonetic:'/lets miːt ˈhɑːfweɪ/',        meaning:'절충점을 찾다',              example:'Let\'s meet halfway on the delivery timeline.',          source:'curated' },
  { category:'negotiation', level:'essential', word:'that\'s our final offer', phonetic:'/ðæts aʊər ˈfaɪnəl ˈɒfər/', meaning:'최종 제안입니다',          example:'That\'s our final offer — 10% discount.',               source:'curated' },
  { category:'negotiation', level:'essential', word:'subject to',            phonetic:'/ˈsʌbdʒɪkt tuː/',            meaning:'~를 조건으로',              example:'This is subject to legal team approval.',               source:'curated' },
  { category:'negotiation', level:'essential', word:'contingent on',         phonetic:'/kənˈtɪndʒənt ɒn/',          meaning:'~에 달려있다',              example:'The deal is contingent on passing quality inspection.',  source:'curated' },
  { category:'negotiation', level:'essential', word:'intellectual property',  phonetic:'/ˌɪntəˈlektʃʊəl ˈprɒpəti/', meaning:'지식재산권 (IP)',           example:'IP ownership must be clarified before we proceed.',     source:'curated' },
  { category:'negotiation', level:'essential', word:'NDA',                    phonetic:'/en diː eɪ/',                meaning:'비밀유지협약',              example:'Please sign the NDA before we share our formulation.',  source:'curated' },
  { category:'negotiation', level:'essential', word:'exclusive rights',       phonetic:'/ɪkˈskluːsɪv raɪts/',       meaning:'독점권',                   example:'We\'d like exclusive rights to produce this in Asia.',  source:'curated' },
  { category:'negotiation', level:'advanced',  word:'milestone',              phonetic:'/ˈmaɪlstoʊn/',              meaning:'마일스톤, 중요 단계',        example:'Payment will be tied to project milestones.',           source:'curated' },
  { category:'negotiation', level:'advanced',  word:'indemnification',        phonetic:'/ɪnˌdemnɪfɪˈkeɪʃən/',       meaning:'면책, 배상',                example:'The contract includes an indemnification clause.',      source:'curated' },
]

// ── 전체 합본 ─────────────────────────────────────────────
export const ALL_VOCAB: VocabWord[] = [...VOCAB_DB, ...EXTRA_VOCAB, ...MEETING_EXTRA]

export const MEETING_EXTRA: VocabWord[] = [
  // ── 회의 시작 ────────────────────────────────────────────
  { category:'meeting', level:'essential', word:'Let\'s get started',          phonetic:'/lets ɡet ˈstɑːrtɪd/',           meaning:'시작하겠습니다',               example:'Okay everyone, let\'s get started.',                      source:'curated' },
  { category:'meeting', level:'essential', word:'Shall we kick off',           phonetic:'/ʃæl wiː kɪk ɒf/',               meaning:'시작할까요?',                  example:'Shall we kick off with a quick update?',                  source:'curated' },
  { category:'meeting', level:'essential', word:'Before we begin',             phonetic:'/bɪˈfɔːr wiː bɪˈɡɪn/',           meaning:'시작하기 전에',                example:'Before we begin, any updates from last time?',            source:'curated' },
  { category:'meeting', level:'essential', word:'Today\'s agenda',             phonetic:'/təˈdeɪz əˈdʒendə/',             meaning:'오늘 안건',                    example:'Today\'s agenda covers three main topics.',               source:'curated' },
  { category:'meeting', level:'essential', word:'For the record',              phonetic:'/fɔːr ðə ˈrekərd/',               meaning:'공식적으로 기록해두자면',       example:'For the record, we agreed on a 30-day lead time.',        source:'curated' },

  // ── 의견 제시 ────────────────────────────────────────────
  { category:'meeting', level:'essential', word:'From my perspective',         phonetic:'/frɒm maɪ pərˈspektɪv/',          meaning:'제 관점에서는',               example:'From my perspective, the yield issue is critical.',       source:'curated' },
  { category:'meeting', level:'essential', word:'My take on this is',          phonetic:'/maɪ teɪk ɒn ðɪs ɪz/',           meaning:'제 생각은',                   example:'My take on this is that we need more data.',              source:'curated' },
  { category:'meeting', level:'essential', word:'If I may suggest',            phonetic:'/ɪf aɪ meɪ səˈdʒest/',           meaning:'제안해도 될까요',              example:'If I may suggest, we try a lower cure temperature.',      source:'curated' },
  { category:'meeting', level:'essential', word:'Building on that',            phonetic:'/ˈbɪldɪŋ ɒn ðæt/',               meaning:'그 의견에 덧붙여',             example:'Building on that, we could also test at 100°C.',          source:'curated' },
  { category:'meeting', level:'essential', word:'Along those lines',           phonetic:'/əˈlɒŋ ðoʊz laɪnz/',             meaning:'그와 관련해서',               example:'Along those lines, I have a similar suggestion.',         source:'curated' },
  { category:'meeting', level:'essential', word:'That said',                   phonetic:'/ðæt sed/',                        meaning:'그렇긴 하지만',               example:'That said, we still need to hit the deadline.',           source:'curated' },
  { category:'meeting', level:'essential', word:'To be frank',                 phonetic:'/tuː biː fræŋk/',                  meaning:'솔직히 말하면',               example:'To be frank, the current yield is not acceptable.',       source:'curated' },
  { category:'meeting', level:'essential', word:'As far as I know',            phonetic:'/æz fɑːr æz aɪ noʊ/',             meaning:'제가 아는 한',                example:'As far as I know, no one has tried this approach.',       source:'curated' },

  // ── 동의 / 반대 ──────────────────────────────────────────
  { category:'meeting', level:'essential', word:'I\'m on board',               phonetic:'/aɪm ɒn bɔːrd/',                  meaning:'동의합니다, 찬성이에요',       example:'I\'m on board with the new testing protocol.',            source:'curated' },
  { category:'meeting', level:'essential', word:'I\'d have to disagree',       phonetic:'/aɪd hæv tuː ˌdɪsəˈɡriː/',       meaning:'저는 동의하기 어렵습니다',     example:'I\'d have to disagree — the data doesn\'t support that.', source:'curated' },
  { category:'meeting', level:'essential', word:'That makes sense',            phonetic:'/ðæt meɪks sens/',                 meaning:'그게 맞는 것 같아요',         example:'That makes sense given the viscosity results.',           source:'curated' },
  { category:'meeting', level:'essential', word:'I\'m not convinced',          phonetic:'/aɪm nɒt kənˈvɪnst/',             meaning:'납득이 안 됩니다',             example:'I\'m not convinced the mechanism is correct.',            source:'curated' },
  { category:'meeting', level:'essential', word:'I see where you\'re coming from', phonetic:'/aɪ siː weər jʊər ˈkʌmɪŋ frɒm/', meaning:'무슨 말씀인지 알겠어요',  example:'I see where you\'re coming from, but our data differs.',  source:'curated' },
  { category:'meeting', level:'advanced',  word:'I\'ll defer to you on that',  phonetic:'/aɪl dɪˈfɜːr tuː juː ɒn ðæt/',   meaning:'그 부분은 당신 의견을 따를게요', example:'I\'ll defer to you on that — you know the process better.', source:'curated' },

  // ── 질문 / 확인 ──────────────────────────────────────────
  { category:'meeting', level:'essential', word:'Can I jump in',               phonetic:'/kæn aɪ dʒʌmp ɪn/',              meaning:'끼어들어도 될까요?',           example:'Can I jump in with a quick question?',                    source:'curated' },
  { category:'meeting', level:'essential', word:'Just to confirm',             phonetic:'/dʒʌst tuː kənˈfɜːrm/',           meaning:'확인 차 여쭤보면',             example:'Just to confirm — the target Tg is 150°C, right?',        source:'curated' },
  { category:'meeting', level:'essential', word:'What\'s the status on',       phonetic:'/wɒts ðə ˈsteɪtəs ɒn/',          meaning:'~의 현황이 어떻게 되나요?',    example:'What\'s the status on the TGA results?',                  source:'curated' },
  { category:'meeting', level:'essential', word:'Can you give us an update',   phonetic:'/kæn juː ɡɪv ʌs ən ˈʌpdeɪt/',   meaning:'업데이트 해주시겠어요?',       example:'Can you give us an update on the synthesis batch?',       source:'curated' },
  { category:'meeting', level:'essential', word:'To make sure I understand',   phonetic:'/tuː meɪk ʃʊər aɪ ˌʌndəˈstænd/', meaning:'제가 제대로 이해했는지',      example:'To make sure I understand — we\'re using AIBN, correct?', source:'curated' },

  // ── 마무리 / 정리 ─────────────────────────────────────────
  { category:'meeting', level:'essential', word:'Let\'s recap',                phonetic:'/lets ˈriːkæp/',                  meaning:'정리해봅시다',                example:'Let\'s recap what we decided today.',                     source:'curated' },
  { category:'meeting', level:'essential', word:'To summarize the next steps', phonetic:'/tuː ˈsʌməraɪz ðə nekst steps/', meaning:'다음 단계를 정리하면',         example:'To summarize the next steps: run DSC by Friday.',         source:'curated' },
  { category:'meeting', level:'essential', word:'Who\'s taking ownership',     phonetic:'/huːz ˈteɪkɪŋ ˈoʊnərʃɪp/',      meaning:'누가 담당하실 건가요?',        example:'Who\'s taking ownership of the scale-up test?',           source:'curated' },
  { category:'meeting', level:'essential', word:'Let\'s set a deadline',       phonetic:'/lets set ə ˈdedlaɪn/',           meaning:'마감일을 정합시다',            example:'Let\'s set a deadline — how does next Thursday work?',    source:'curated' },
  { category:'meeting', level:'essential', word:'Any other business',          phonetic:'/ˈeni ˈʌðər ˈbɪznɪs/',           meaning:'다른 안건 있으신가요?',        example:'Any other business before we close?',                     source:'curated' },
  { category:'meeting', level:'essential', word:'Let\'s table this for now',   phonetic:'/lets ˈteɪbəl ðɪs fɔːr naʊ/',    meaning:'일단 보류합시다',              example:'Let\'s table this for now and revisit next week.',        source:'curated' },
  { category:'meeting', level:'advanced',  word:'I\'ll take that as a yes',    phonetic:'/aɪl teɪk ðæt æz ə jes/',        meaning:'동의하신 걸로 알겠습니다',     example:'No objections? I\'ll take that as a yes.',                source:'curated' },
]

// 최종 전체 단어 배열 업데이트
export const FULL_VOCAB: VocabWord[] = [...VOCAB_DB, ...EXTRA_VOCAB, ...MEETING_EXTRA]

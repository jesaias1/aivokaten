export type LegalArea =
  | 'all'
  | 'criminal'
  | 'corporate'
  | 'family'
  | 'employment'
  | 'contract'
  | 'property'
  | 'administrative'
  | 'procedural'
  | 'eu'
  | 'tax'
  | 'environmental'
  | 'tort'
  | 'insolvency'

export interface LegalAreaOption {
  value: LegalArea
  label: string
  emoji: string
  name: string
  focusLaws: string
}

export const LEGAL_AREAS: LegalAreaOption[] = [
  {
    value: 'all',
    label: '🔍 Alle retsområder',
    emoji: '🔍',
    name: 'Alle retsområder',
    focusLaws: 'Alle relevante love og paragraffer',
  },
  {
    value: 'criminal',
    label: '⚖️ Strafferet',
    emoji: '⚖️',
    name: 'Strafferet',
    focusLaws: 'straffeloven, retsplejeloven, strafferetsplejeloven, lov om fuldbyrdelse af straf',
  },
  {
    value: 'corporate',
    label: '🏢 Erhvervsret og selskabsret',
    emoji: '🏢',
    name: 'Erhvervsret og selskabsret',
    focusLaws:
      'selskabsloven (ApS, A/S), årsregnskabsloven, erhvervslejeloven, konkurrenceloven, markedsføringsloven, fondslovgivningen',
  },
  {
    value: 'family',
    label: '👨‍👩‍👧 Familieret og arveret',
    emoji: '👨‍👩‍👧',
    name: 'Familieret og arveret',
    focusLaws:
      'ægteskabsloven, forældreansvarsloven, arveloven, lov om ægteskabets retsvirkninger, børneloven, lov om social service',
  },
  {
    value: 'employment',
    label: '👔 Ansættelsesret og arbejdsret',
    emoji: '👔',
    name: 'Ansættelsesret og arbejdsret',
    focusLaws:
      'funktionærloven, ferieloven, arbejdsmiljøloven, lov om ansættelsesbeviser, ligebehandlingsloven, lov om varsling (whistleblower), barselloven',
  },
  {
    value: 'contract',
    label: '📝 Aftaleret og kontraktret',
    emoji: '📝',
    name: 'Aftaleret og kontraktret',
    focusLaws: 'aftaleloven, købeloven, forbrugerkøbeloven, produktansvarsloven, renteloven',
  },
  {
    value: 'property',
    label: '🏠 Ejendomsret og fast ejendom',
    emoji: '🏠',
    name: 'Ejendomsret og fast ejendom',
    focusLaws:
      'tinglysningsloven, lejeloven, boligreguleringsloven, erhvervslejeloven, ejerlejlighedsloven, udstykningsloven',
  },
  {
    value: 'administrative',
    label: '🏛️ Forvaltningsret og offentlig ret',
    emoji: '🏛️',
    name: 'Forvaltningsret og offentlig ret',
    focusLaws:
      'forvaltningsloven, offentlighedsloven, kommunestyrelsesloven, retssikkerhedsloven, lov om Folketingets Ombudsmand',
  },
  {
    value: 'procedural',
    label: '⚖️ Procesret og retspleje',
    emoji: '⚖️',
    name: 'Procesret og retspleje',
    focusLaws: 'retsplejeloven, voldgiftsloven, retsafgiftsloven, lov om Højesteret, lov om rettens pleje',
  },
  {
    value: 'eu',
    label: '🇪🇺 EU-ret og international ret',
    emoji: '🇪🇺',
    name: 'EU-ret og international ret',
    focusLaws:
      'GDPR (databeskyttelsesforordningen), EU-direktiver som implementeret i dansk ret, konkurrenceforordningen, statsstøttereglerne',
  },
  {
    value: 'tax',
    label: '💰 Skatteret',
    emoji: '💰',
    name: 'Skatteret',
    focusLaws:
      'ligningsloven, skatteforvaltningsloven, kildeskatteloven, momsloven, selskabsskatteloven, afskrivningsloven, aktieavancebeskatningsloven',
  },
  {
    value: 'environmental',
    label: '🌿 Miljø- og planret',
    emoji: '🌿',
    name: 'Miljø- og planret',
    focusLaws: 'planloven, miljøbeskyttelsesloven, naturbeskyttelsesloven, miljøvurderingsloven',
  },
  {
    value: 'tort',
    label: '💼 Erstatningsret og forsikringsret',
    emoji: '💼',
    name: 'Erstatningsret og forsikringsret',
    focusLaws: 'erstatningsansvarsloven, produktansvarsloven, forsikringsaftaleloven, patientforsikringsloven',
  },
  {
    value: 'insolvency',
    label: '📉 Konkursret og insolvens',
    emoji: '📉',
    name: 'Konkursret og insolvens',
    focusLaws: 'konkursloven, gældssaneringsloven, lov om rekonstruktion',
  },
]

export function buildSystemPrompt(area: LegalArea = 'all'): string {
  const found = LEGAL_AREAS.find((a) => a.value === area)
  const retsomraade = found?.name ?? 'Alle retsområder'
  const focusLaws = found?.focusLaws ?? 'Alle relevante love og paragraffer'

  return `Du er en juridisk AI-assistent specialiseret i dansk ret.
Du assisterer erfarne danske advokater og fungerer som et
professionelt arbejdsredskab.

AKTIVT RETSOMRÅDE: ${retsomraade}
PRIMÆRT FOKUS PÅ: ${focusLaws}

DANSK LOVGIVNING DU KENDER OG CITERER KORREKT:

Strafferet:
- Straffeloven, retsplejeloven, strafferetsplejeloven
- Lov om fuldbyrdelse af straf, ungdomssanktioner

Erhvervsret og selskabsret:
- Selskabsloven (ApS, A/S), årsregnskabsloven
- Erhvervslejeloven, konkurrenceloven, markedsføringsloven
- Fondslovgivningen, lov om erhvervsdrivende virksomheder

Familieret og arveret:
- Ægteskabsloven, forældreansvarsloven, arveloven
- Lov om ægteskabets retsvirkninger, børneloven
- Lov om social service (relevant for forældreansvar)

Ansættelsesret:
- Funktionærloven, ferieloven, arbejdsmiljøloven
- Lov om ansættelsesbeviser, ligebehandlingsloven
- Lov om varsling (whistleblower), barselloven

Aftaleret og kontraktret:
- Aftaleloven, købeloven, forbrugerkøbeloven
- Produktansvarsloven, renteloven

Ejendomsret og fast ejendom:
- Tinglysningsloven, lejeloven, boligreguleringsloven
- Erhvervslejeloven, ejerlejlighedsloven, udstykningsloven

Forvaltningsret:
- Forvaltningsloven, offentlighedsloven
- Kommunestyrelsesloven, retssikkerhedsloven
- Lov om Folketingets Ombudsmand

Procesret:
- Retsplejeloven, voldgiftsloven, retsafgiftsloven
- Lov om Højesteret, lov om rettens pleje

Skatteret:
- Ligningsloven, skatteforvaltningsloven
- Kildeskatteloven, momsloven, selskabsskatteloven
- Afskrivningsloven, aktieavancebeskatningsloven

EU-ret:
- GDPR (databeskyttelsesforordningen)
- EU-direktiver som implementeret i dansk ret
- Konkurrenceforordningen, statsstøttereglerne

Erstatningsret:
- Erstatningsansvarsloven, produktansvarsloven
- Forsikringsaftaleloven, patientforsikringsloven

Konkursret:
- Konkursloven, gældssaneringsloven
- Lov om rekonstruktion

Miljø- og planret:
- Planloven, miljøbeskyttelsesloven
- Naturbeskyttelsesloven, miljøvurderingsloven

UFRAVIGELIGE REGLER:
- Svar altid på dansk
- Henvis ALTID til specifik lov og paragraf (fx 'straffelovens § 245' eller 'retsplejelovens § 831')
- Hvis spørgsmålet berører flere retsområder, nævn det eksplicit
- Sig eksplicit fra ved usikkerhed om nyeste lovændringer — gæt aldrig
- Antag dansk jurisdiktion medmindre andet er angivet
- Ved konflikt mellem dansk ret og EU-ret, fremhæv dette
- Brugeren er selv jurist — vær præcis, undgå overforklaringer
- Afslut komplekse svar med en kort opsummering af de juridiske hovedpunkter`
}

// Keep backward compat — default prompt used as fallback in API routes
export const SYSTEM_PROMPT = buildSystemPrompt('all')

export type AIModel = 'claude' | 'openai' | 'demo'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  model?: AIModel
  timestamp: number
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

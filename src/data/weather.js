// Six weather states — each partner picks one
export const WEATHER_STATES = [
  {
    id: 'sunny',
    label: 'Sunny',
    emoji: '☀️',
    description: 'Clear, light, easy',
    sub: 'I feel open and ready to play',
    pole: 'open',
    color: '#f0d080',
  },
  {
    id: 'warm',
    label: 'Warm',
    emoji: '🌤️',
    description: 'Soft, tender, close',
    sub: 'I want to be near you',
    pole: 'open',
    color: '#d1a07b',
  },
  {
    id: 'electric',
    label: 'Electric',
    emoji: '⚡',
    description: 'Charged, alive, wanting',
    sub: 'I feel drawn and awake',
    pole: 'open',
    color: '#e87c7c',
  },
  {
    id: 'foggy',
    label: 'Foggy',
    emoji: '🌫️',
    description: 'Unclear, drifting, absent',
    sub: 'I\'m not quite here yet',
    pole: 'closed',
    color: '#94a3b8',
  },
  {
    id: 'stormy',
    label: 'Stormy',
    emoji: '⛈️',
    description: 'Tense, hurt, or charged',
    sub: 'Something is unresolved',
    pole: 'closed',
    color: '#7cb8e8',
  },
  {
    id: 'frozen',
    label: 'Frozen',
    emoji: '❄️',
    description: 'Numb, tired, shut down',
    sub: 'I need gentle warmth',
    pole: 'closed',
    color: '#a5b4fc',
  },
]

// Four relationship territories determined by the pair
export const TERRITORIES = {
  'aligned-open': {
    id: 'aligned-open',
    label: 'Aligned Open',
    icon: '✨',
    color: '#d1a07b',
    tagline: 'Both arriving warm.',
    description: 'The weather is already hospitable. These practices deepen what is already here. Don\'t waste the weather.',
    guideline: 'Deepen',
  },
  'aligned-closed': {
    id: 'aligned-closed',
    label: 'Aligned Closed',
    icon: '🌙',
    color: '#94a3b8',
    tagline: 'Both arriving quiet.',
    description: 'Neither has to carry it alone. These practices rebuild the nervous-system floor first — no performance, no pressure.',
    guideline: 'Rest together',
  },
  'mismatched': {
    id: 'mismatched',
    label: 'Mismatched',
    icon: '🌉',
    color: '#8b7cf6',
    tagline: 'One open, one closed.',
    description: 'The open partner meets the closed one, never the other way round. These practices are bridges — non-asking forms of contact.',
    guideline: 'Bridge',
  },
  'storm-present': {
    id: 'storm-present',
    label: 'Storm Present',
    icon: '⛈️',
    color: '#7cb8e8',
    tagline: 'Something is unresolved.',
    description: 'Clearing before conversation, always. The body settles first; the words come after.',
    guideline: 'Settle first',
  },
}

// Determine territory from two weather states
export function getTerritory(stateIdA, stateIdB) {
  const stateMap = Object.fromEntries(WEATHER_STATES.map(s => [s.id, s.pole]))
  const poleA = stateMap[stateIdA]
  const poleB = stateMap[stateIdB]
  const isStormy = stateIdA === 'stormy' || stateIdB === 'stormy'

  if (isStormy) return 'storm-present'
  if (poleA === 'open' && poleB === 'open') return 'aligned-open'
  if (poleA === 'closed' && poleB === 'closed') return 'aligned-closed'
  return 'mismatched'
}

// Normalize pair key (order-independent)
export function getPairKey(a, b) {
  const order = ['sunny', 'warm', 'electric', 'foggy', 'stormy', 'frozen']
  const [x, y] = [a, b].sort((i, j) => order.indexOf(i) - order.indexOf(j))
  return `${x}×${y}`
}

// Pair-level context blurbs (21 unique combinations)
export const PAIR_CONTEXT = {
  'sunny×sunny': 'You\'re both in exactly the same clear, playful place. Rare and beautiful — go all the way in.',
  'sunny×warm': 'Lightness meets tenderness. A beautiful combination for warmth and gentle exploration.',
  'sunny×electric': 'One of you is relaxed, the other is charged. Let the relaxed one anchor the charge.',
  'warm×warm': 'Both soft, both wanting closeness. The conditions are perfect for slow, deep connection.',
  'warm×electric': 'Tenderness meets desire. The warmth grounds the electricity — one of the richest pairings.',
  'electric×electric': 'Both charged and awake. Channel this energy deliberately — it can easily overshoot.',
  'foggy×foggy': 'Both unclear, both present. You don\'t have to be anywhere else. Rest here together.',
  'foggy×frozen': 'One drifting, one numb. No pressure. Small warmth practices rebuild the floor.',
  'frozen×frozen': 'Both very quiet. The most gentle practices in the library are for exactly this.',
  'sunny×foggy': 'One is clear; the other is elsewhere. Meet them where they are — never pull.',
  'sunny×frozen': 'One bright, one shut down. Small acts of warmth without demand.',
  'warm×foggy': 'One wanting closeness; the other isn\'t quite here. Tender patience.',
  'warm×frozen': 'Warmth meeting numbness. Presence without expectation is the whole practice.',
  'electric×foggy': 'Desire meets absence. The charged partner offers presence, not pursuit.',
  'electric×frozen': 'Aliveness meeting shutdown. Offer your energy as shelter, not demand.',
  'sunny×stormy': 'One light; the other holding something difficult. Hold the space. Don\'t fix.',
  'warm×stormy': 'Tenderness meeting tension. The warmth can be a landing place — if it doesn\'t ask.',
  'electric×stormy': 'Charge meeting hurt. Body-settling practices first. Always.',
  'foggy×stormy': 'Drift meeting storm. Quiet the body before anything else.',
  'stormy×stormy': 'Both holding something live. Release first — through breath or movement — before words.',
  'stormy×frozen': 'Storm meeting ice. The most careful practices in the library. Gentle, non-demanding.',
}

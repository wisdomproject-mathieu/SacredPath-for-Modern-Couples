import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, ChevronRight, Lock } from 'lucide-react'
import { RITUALS, THEMES } from '../data/rituals'
import { usePlan } from '../context/PlanContext'
import PaywallSheet from '../components/PaywallSheet'

// First 3 rituals per theme are free
const FREE_RITUAL_IDS = new Set(
  THEMES.flatMap(theme =>
    RITUALS.filter(r => r.theme === theme.id).slice(0, 3).map(r => r.id)
  )
)

export default function Library() {
  const navigate = useNavigate()
  const { isPremium } = usePlan()
  const [searchParams] = useSearchParams()
  const [activeTheme, setActiveTheme] = useState(searchParams.get('theme') || 'all')
  const [query, setQuery] = useState('')
  const [paywallOpen, setPaywallOpen] = useState(false)

  const filtered = useMemo(() => {
    return RITUALS.filter(r => {
      const matchTheme = activeTheme === 'all' || r.theme === activeTheme
      const matchQuery = !query || r.title.toLowerCase().includes(query.toLowerCase())
      return matchTheme && matchQuery
    })
  }, [activeTheme, query])

  const themeColor = THEMES.find(t => t.id === activeTheme)?.color || '#d1a07b'

  return (
    <div className="min-h-screen pb-32 pt-12">
      {/* Header */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-copper/60 uppercase tracking-[0.3em] mb-2">The</p>
          <h1 className="text-3xl font-serif font-medium glow-text">Sacred Library</h1>
          <p className="text-sm text-white/40 mt-1">81 rituals across 8 paths</p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="card flex items-center gap-3 px-4 py-3">
          <Search size={16} className="text-white/30 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search rituals..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full"
          />
        </div>
      </div>

      {/* Theme Filter */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 mb-2 scrollbar-none">
        <button
          onClick={() => setActiveTheme('all')}
          className={`flex-shrink-0 text-xs px-4 py-2 rounded-full border transition-all duration-200 ${
            activeTheme === 'all'
              ? 'bg-copper text-charcoal border-copper font-semibold'
              : 'border-charcoal-border text-white/50 hover:text-white/80'
          }`}
        >
          All 81
        </button>
        {THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => setActiveTheme(theme.id)}
            className={`flex-shrink-0 text-xs px-4 py-2 rounded-full border transition-all duration-200 ${
              activeTheme === theme.id
                ? 'font-semibold'
                : 'border-charcoal-border text-white/50 hover:text-white/80'
            }`}
            style={
              activeTheme === theme.id
                ? { background: `${theme.color}20`, borderColor: `${theme.color}60`, color: theme.color }
                : {}
            }
          >
            {theme.icon} {theme.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="px-4 mb-3">
        <p className="text-xs text-white/30">
          {filtered.length} {filtered.length === 1 ? 'ritual' : 'rituals'}
          {activeTheme !== 'all' && ` in ${THEMES.find(t => t.id === activeTheme)?.label}`}
        </p>
      </div>

      {/* Ritual List */}
      <div className="px-4 space-y-2">
        <AnimatePresence>
          {filtered.map((ritual, i) => {
            const theme = THEMES.find(t => t.id === ritual.theme)
            const locked = !isPremium && !FREE_RITUAL_IDS.has(ritual.id)
            return (
              <motion.button
                key={ritual.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                onClick={() => locked ? setPaywallOpen(true) : navigate(`/ritual/${ritual.id}`)}
                className={`card w-full text-left p-4 active:scale-98 transition-all duration-150 ${
                  locked ? 'opacity-60' : 'hover:border-copper/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-lg"
                    style={{ background: `${theme?.color}15`, border: `1px solid ${theme?.color}30` }}
                  >
                    {locked ? <Lock size={14} className="text-white/30" /> : theme?.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm font-serif font-medium truncate ${locked ? 'text-white/40' : ''}`}>
                        {ritual.title}
                      </h3>
                      {locked
                        ? <span className="text-[9px] text-white/25 flex-shrink-0 border border-white/10 rounded-full px-1.5 py-0.5">Sacred</span>
                        : <span className="text-[10px] text-white/25 flex-shrink-0">#{ritual.id}</span>
                      }
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{ritual.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-white/30 flex items-center gap-1">
                        <Clock size={9} />{ritual.duration}
                      </span>
                      {!locked && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{ background: `${theme?.color}15`, color: theme?.color }}
                        >
                          {ritual.intensity}
                        </span>
                      )}
                    </div>
                  </div>
                  {locked
                    ? <Lock size={13} className="text-white/20 flex-shrink-0 mt-1" />
                    : <ChevronRight size={14} className="text-white/20 flex-shrink-0 mt-1" />
                  }
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      <PaywallSheet isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  )
}

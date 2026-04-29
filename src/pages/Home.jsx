import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Sparkles, ChevronRight, Heart } from 'lucide-react'
import { Card } from '../components/Card'
import { RITUALS, THEMES } from '../data/rituals'
import { WEATHER_PRACTICES } from '../data/weatherPractices'
import { usePlan } from '../context/PlanContext'
import PaywallSheet from '../components/PaywallSheet'

const DAILY_PRACTICES = [
  { id: 3, title: 'The Naming Ritual', duration: '10 min', theme: 'verbal-play' },
  { id: 22, title: 'Heartbeat Sync', duration: '15 min', theme: 'sensory' },
  { id: 45, title: 'Morning Ritual', duration: '15 min', theme: 'presence' },
  { id: 49, title: 'The Check-In', duration: '10 min', theme: 'presence' },
  { id: 29, title: 'Gaze Hold', duration: '10 min', theme: 'restraint' },
  { id: 7, title: 'Devotion Phrases', duration: '10 min', theme: 'verbal-play' },
  { id: 52, title: 'The Evening Debrief', duration: '15 min', theme: 'presence' },
]

const L1_MICRO = WEATHER_PRACTICES.filter(p => p.level === 'L1')

function ConnectionRing({ progress, label, color }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#2e2831" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-serif font-semibold text-copper">{progress}%</span>
        </div>
      </div>
      <span className="text-xs text-white/50 tracking-wider uppercase">{label}</span>
    </div>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function Home() {
  const navigate = useNavigate()
  const { isPremium } = usePlan()
  const [paywallOpen, setPaywallOpen] = useState(false)
  const today = new Date().getDay()
  const dailyPractice = DAILY_PRACTICES[today]
  const ritual = RITUALS.find(r => r.id === dailyPractice.id)
  const theme = THEMES.find(t => t.id === dailyPractice.theme)
  const microRitual = L1_MICRO[today % L1_MICRO.length]

  const [streak] = useState(7)
  const [microDone, setMicroDone] = useState(false)
  const [microExpanded, setMicroExpanded] = useState(false)

  return (
    <div className="min-h-screen pb-32 px-4 pt-12">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8 text-center relative">
        <p className="text-xs text-copper/60 uppercase tracking-[0.3em] mb-2">Sacred Path</p>
        <h1 className="text-3xl font-serif font-medium glow-text">Your Journey</h1>
        <p className="text-sm text-white/40 mt-1">Together, awakening</p>
        {/* Plan badge */}
        <button
          onClick={() => !isPremium && setPaywallOpen(true)}
          className="absolute top-0 right-0 flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border transition-colors"
          style={isPremium
            ? { borderColor: '#d1a07b40', background: '#d1a07b12', color: '#d1a07b' }
            : { borderColor: '#2e2831', background: '#1a171c', color: 'rgba(255,255,255,0.3)' }
          }
        >
          {isPremium ? '✨ Sacred' : '⬆ Upgrade'}
        </button>
      </motion.div>

      {/* Connection Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6 mb-4" glow>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Connection</h2>
            <div className="flex items-center gap-1 text-copper text-xs">
              <Flame size={12} />
              <span>{streak} day streak</span>
            </div>
          </div>
          <div className="flex justify-around items-center">
            <ConnectionRing progress={72} label="Intimacy" color="#d1a07b" />
            <ConnectionRing progress={58} label="Presence" color="#8b7cf6" />
            <ConnectionRing progress={84} label="Trust" color="#88d8c0" />
          </div>
          <div className="mt-5 pt-4 border-t border-charcoal-border flex items-center justify-between">
            <span className="text-xs text-white/40">8 rituals this week</span>
            <div className="flex gap-1">
              {[1,1,1,1,1,0,0].map((done, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${done ? 'bg-copper' : 'bg-charcoal-border'}`}
                />
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Daily Practice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Today's Practice</h2>
          <span className="text-xs text-copper/60">{theme?.icon} {theme?.label}</span>
        </div>
        <Card
          className="p-5 mb-4"
          onClick={() => navigate(`/ritual/${ritual.id}`)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-copper/10 text-copper px-2 py-0.5 rounded-full border border-copper/20">
                  {ritual.intensity}
                </span>
                <span className="text-xs text-white/30">{ritual.duration}</span>
              </div>
              <h3 className="text-lg font-serif font-medium mb-1">{ritual.title}</h3>
              <p className="text-sm text-white/50 line-clamp-2">{ritual.description}</p>
            </div>
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-copper/10 border border-copper/20 flex items-center justify-center">
              <ChevronRight size={16} className="text-copper" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-charcoal-border">
            <span className="btn-primary text-xs px-4 py-2 inline-block rounded-lg">Begin Ritual</span>
          </div>
        </Card>
      </motion.div>

      {/* Recent Themes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Explore Themes</h2>
          <button
            onClick={() => navigate('/library')}
            className="text-xs text-copper/70 hover:text-copper transition-colors"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              onClick={() => navigate(`/library?theme=${t.id}`)}
              className="card p-3 flex flex-col items-center gap-1.5 hover:border-copper/20 transition-colors"
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="text-[9px] text-white/50 text-center leading-tight">{t.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Today's Micro-Ritual */}
      {microRitual && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest">2-Minute Practice</h2>
            <span className="text-xs text-white/30">{microRitual.duration}</span>
          </div>
          <div
            className={`rounded-2xl border overflow-hidden transition-colors duration-200 ${
              microDone ? 'border-copper/30 bg-copper/5' : 'border-charcoal-border bg-charcoal-surface'
            }`}
          >
            <button className="w-full text-left p-4" onClick={() => setMicroExpanded(!microExpanded)}>
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all ${
                    microDone ? 'bg-copper text-charcoal' : 'bg-copper/15 text-copper border border-copper/25'
                  }`}
                >
                  {microDone ? '✓' : 'L1'}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-serif font-medium ${microDone ? 'text-white/50' : 'text-white'}`}>
                    {microRitual.title}
                  </p>
                  <p className="text-xs text-white/35 mt-0.5">{microRitual.lineage}</p>
                </div>
                <ChevronRight
                  size={14}
                  className={`text-white/20 mt-1 transition-transform duration-200 ${microExpanded ? 'rotate-90' : ''}`}
                />
              </div>
              {!microExpanded && (
                <p className="text-xs text-white/40 mt-2 leading-relaxed line-clamp-2 pl-11">
                  {microRitual.description}
                </p>
              )}
            </button>

            {microExpanded && (
              <div className="px-4 pb-4">
                <p className="text-xs text-white/60 leading-relaxed mb-3">{microRitual.description}</p>
                <div className="space-y-2 mb-4">
                  {microRitual.steps.map((s, i) => (
                    <div key={i} className="flex gap-2.5">
                      <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-semibold mt-0.5 bg-copper/15 text-copper border border-copper/25">
                        {i + 1}
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { setMicroDone(true); setMicroExpanded(false) }}
                  className="w-full btn-primary text-xs py-2"
                >
                  Mark Complete
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Invitation Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-4"
      >
        <div
          className="rounded-2xl p-5 relative overflow-hidden cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #1a171c 0%, #241f27 100%)' }}
          onClick={() => navigate('/weather')}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-copper/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-copper" />
              <span className="text-xs text-copper/70 uppercase tracking-widest">Intimacy Weather</span>
            </div>
            <p className="text-sm font-serif">How is your connection <em>today?</em></p>
            <p className="text-xs text-white/40 mt-1">Find the perfect practice for right now</p>
          </div>
          <div className="flex items-center gap-1 mt-3 text-copper text-xs">
            <Heart size={10} />
            <span>Check your weather</span>
            <ChevronRight size={10} />
          </div>
        </div>
      </motion.div>

      {/* Thread teaser */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-3"
      >
        <div
          className="rounded-2xl border border-charcoal-border p-4 cursor-pointer hover:border-white/10 transition-colors"
          onClick={() => navigate('/thread')}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-charcoal-elevated flex items-center justify-center flex-shrink-0">
              <Heart size={16} className="text-copper/60" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white/80">Love Thread</p>
              <p className="text-xs text-white/35 mt-0.5">Write something you love about each other</p>
            </div>
            <ChevronRight size={14} className="text-white/20" />
          </div>
        </div>
      </motion.div>

      <PaywallSheet isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  )
}

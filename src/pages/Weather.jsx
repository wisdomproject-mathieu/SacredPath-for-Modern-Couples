import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight, RefreshCcw, Clock, Sparkles, Lock } from 'lucide-react'
import { WEATHER_STATES, TERRITORIES, PAIR_CONTEXT, getTerritory, getPairKey } from '../data/weather'
import { getPracticesForTerritory } from '../data/weatherPractices'
import { usePlan } from '../context/PlanContext'
import PaywallSheet from '../components/PaywallSheet'

const LEVEL_META = {
  L1: { label: 'Quick', sub: 'Under 15 min', color: '#d1a07b' },
  L2: { label: 'Active', sub: '15–90 min', color: '#8b7cf6' },
  L3: { label: 'Extended', sub: '60 min+', color: '#e87c7c' },
}

export default function Weather() {
  const { isPremium } = usePlan()
  const [step, setStep] = useState('partner-a')
  const [stateA, setStateA] = useState(null)
  const [stateB, setStateB] = useState(null)
  const [activeLevel, setActiveLevel] = useState('L1')
  const [expandedPractice, setExpandedPractice] = useState(null)
  const [paywallOpen, setPaywallOpen] = useState(false)

  const territory = stateA && stateB ? getTerritory(stateA, stateB) : null
  const territoryData = territory ? TERRITORIES[territory] : null
  const pairKey = stateA && stateB ? getPairKey(stateA, stateB) : null
  const pairContext = pairKey ? PAIR_CONTEXT[pairKey] : null
  const practices = territory ? getPracticesForTerritory(territory, activeLevel) : []

  const weatherA = WEATHER_STATES.find(s => s.id === stateA)
  const weatherB = WEATHER_STATES.find(s => s.id === stateB)

  const reset = () => {
    setStep('partner-a')
    setStateA(null)
    setStateB(null)
    setActiveLevel('L1')
    setExpandedPractice(null)
  }

  return (
    <div className="min-h-screen pb-32">
      <AnimatePresence mode="wait">

        {/* ── Step 1: Partner A ── */}
        {step === 'partner-a' && (
          <motion.div
            key="partner-a"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="px-4 pt-12"
          >
            <StepDots active={1} />
            <div className="mb-2">
              <p className="text-xs text-copper/60 uppercase tracking-[0.3em] mb-1">Partner A</p>
              <h1 className="text-2xl font-serif font-medium glow-text">How are you arriving?</h1>
              <p className="text-sm text-white/40 mt-1">Choose the weather closest to how you feel right now.</p>
            </div>
            <WeatherGrid
              selected={stateA}
              onSelect={id => {
                setStateA(id)
                setTimeout(() => setStep('partner-b'), 280)
              }}
            />
          </motion.div>
        )}

        {/* ── Step 2: Partner B ── */}
        {step === 'partner-b' && (
          <motion.div
            key="partner-b"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="px-4 pt-12"
          >
            <StepDots active={2} onBack={() => setStep('partner-a')} />

            {weatherA && (
              <div
                className="flex items-center gap-3 rounded-2xl border px-4 py-3 mb-5"
                style={{ borderColor: `${weatherA.color}30`, background: `${weatherA.color}08` }}
              >
                <span className="text-2xl">{weatherA.emoji}</span>
                <div>
                  <p className="text-xs text-white/40">Partner A</p>
                  <p className="text-sm font-medium" style={{ color: weatherA.color }}>{weatherA.label}</p>
                  <p className="text-xs text-white/40">{weatherA.sub}</p>
                </div>
              </div>
            )}

            <div className="mb-2">
              <p className="text-xs text-copper/60 uppercase tracking-[0.3em] mb-1">Partner B</p>
              <h1 className="text-2xl font-serif font-medium glow-text">And you?</h1>
              <p className="text-sm text-white/40 mt-1">There's no wrong weather — just honest weather.</p>
            </div>
            <WeatherGrid
              selected={stateB}
              onSelect={id => {
                setStateB(id)
                setTimeout(() => setStep('result'), 280)
              }}
            />
          </motion.div>
        )}

        {/* ── Step 3: Result ── */}
        {step === 'result' && territory && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Territory Hero */}
            <div
              className="px-4 pt-12 pb-8 relative"
              style={{ background: `linear-gradient(180deg, ${territoryData.color}14 0%, transparent 100%)` }}
            >
              <button
                onClick={reset}
                className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-6"
              >
                <RefreshCcw size={14} />
                <span className="text-sm">Check in again</span>
              </button>

              {/* Partner pills */}
              <div className="flex items-center gap-3 mb-5">
                {weatherA && (
                  <div
                    className="flex items-center gap-2 rounded-full px-3 py-1.5 border text-sm"
                    style={{ borderColor: `${weatherA.color}40`, background: `${weatherA.color}12`, color: weatherA.color }}
                  >
                    <span>{weatherA.emoji}</span>
                    <span className="font-medium">{weatherA.label}</span>
                  </div>
                )}
                <span className="text-white/20 text-lg">+</span>
                {weatherB && (
                  <div
                    className="flex items-center gap-2 rounded-full px-3 py-1.5 border text-sm"
                    style={{ borderColor: `${weatherB.color}40`, background: `${weatherB.color}12`, color: weatherB.color }}
                  >
                    <span>{weatherB.emoji}</span>
                    <span className="font-medium">{weatherB.label}</span>
                  </div>
                )}
              </div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{territoryData.icon}</span>
                  <span
                    className="text-xs px-3 py-1 rounded-full border font-medium"
                    style={{ borderColor: `${territoryData.color}40`, color: territoryData.color, background: `${territoryData.color}10` }}
                  >
                    {territoryData.guideline}
                  </span>
                </div>
                <h1 className="text-3xl font-serif font-medium glow-text mb-1">{territoryData.label}</h1>
                <p className="text-sm text-white/50 italic mb-3">"{territoryData.tagline}"</p>
                <p className="text-sm text-white/60 leading-relaxed">{territoryData.description}</p>
              </motion.div>
            </div>

            {/* Pair context blurb */}
            {pairContext && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-4 mb-5"
              >
                <div
                  className="rounded-2xl border px-4 py-4"
                  style={{ borderColor: `${territoryData.color}20`, background: `${territoryData.color}08` }}
                >
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Sparkles size={10} style={{ color: territoryData.color }} />
                    Your combination
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed">{pairContext}</p>
                </div>
              </motion.div>
            )}

            {/* Level tabs */}
            <div className="px-4 mb-4">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Practices for you</p>
              <div className="flex gap-2">
                {['L1', 'L2', 'L3'].map(level => {
                  const meta = LEVEL_META[level]
                  const count = getPracticesForTerritory(territory, level).length
                  const locked = !isPremium && level !== 'L1'
                  const isActive = activeLevel === level
                  return (
                    <button
                      key={level}
                      onClick={() => {
                        if (locked) { setPaywallOpen(true); return }
                        setActiveLevel(level)
                        setExpandedPractice(null)
                      }}
                      className={`flex-1 rounded-xl border py-2.5 text-center transition-all duration-200 relative overflow-hidden ${
                        isActive && !locked ? '' : 'border-charcoal-border text-white/40 hover:text-white/70'
                      }`}
                      style={isActive && !locked ? {
                        borderColor: `${meta.color}50`,
                        background: `${meta.color}12`,
                        color: meta.color,
                      } : {}}
                    >
                      <p className="text-xs font-semibold flex items-center justify-center gap-1">
                        {locked && <Lock size={9} className="opacity-50" />}
                        {meta.label}
                      </p>
                      <p className="text-[10px] mt-0.5 opacity-60">{meta.sub}</p>
                      <p className="text-[9px] mt-0.5 opacity-40">{count} {count === 1 ? 'practice' : 'practices'}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Practices */}
            <div className="px-4 space-y-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLevel}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  {practices.length === 0 && (
                    <p className="text-sm text-white/30 text-center py-10">
                      No practices in this level for your territory yet.
                    </p>
                  )}
                  {practices.map(practice => (
                    <PracticeCard
                      key={practice.id}
                      practice={practice}
                      levelColor={LEVEL_META[practice.level].color}
                      isExpanded={expandedPractice === practice.id}
                      onToggle={() => setExpandedPractice(
                        expandedPractice === practice.id ? null : practice.id
                      )}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <PaywallSheet isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepDots({ active, onBack }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-1.5 items-center">
        {[1, 2, 3].map(n => (
          <div
            key={n}
            className={`h-1 rounded-full transition-all duration-300 ${
              n === active ? 'w-6 bg-copper' : n < active ? 'w-3 bg-copper/40' : 'w-3 bg-charcoal-border'
            }`}
          />
        ))}
      </div>
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-white/30 hover:text-white/60 transition-colors text-xs"
        >
          <ArrowLeft size={12} />
          Back
        </button>
      )}
    </div>
  )
}

function WeatherGrid({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-5">
      {WEATHER_STATES.map(state => {
        const isSelected = selected === state.id
        return (
          <motion.button
            key={state.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(state.id)}
            className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
              isSelected ? '' : 'border-charcoal-border bg-charcoal-surface hover:border-white/10'
            }`}
            style={isSelected ? {
              borderColor: `${state.color}60`,
              background: `${state.color}14`,
              boxShadow: `0 0 20px ${state.color}20`,
            } : {}}
          >
            <div className="text-2xl mb-2">{state.emoji}</div>
            <p
              className="text-sm font-medium mb-0.5 transition-colors"
              style={{ color: isSelected ? state.color : 'rgba(255,255,255,0.8)' }}
            >
              {state.label}
            </p>
            <p className="text-xs text-white/40 leading-snug">{state.sub}</p>
          </motion.button>
        )
      })}
    </div>
  )
}

function PracticeCard({ practice, levelColor, isExpanded, onToggle }) {
  return (
    <motion.div
      layout
      className="rounded-2xl border overflow-hidden transition-colors duration-200"
      style={{
        borderColor: isExpanded ? `${levelColor}30` : '#2e2831',
        background: isExpanded ? `${levelColor}08` : '#1a171c',
      }}
    >
      <button className="w-full text-left p-4" onClick={onToggle}>
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
            style={{ background: `${levelColor}18`, color: levelColor, border: `1px solid ${levelColor}30` }}
          >
            {practice.level}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-serif font-medium text-white">{practice.title}</h3>
            <p className="text-xs text-white/35 mt-0.5">{practice.lineage}</p>
            <span className="text-[10px] text-white/25 flex items-center gap-1 mt-1.5">
              <Clock size={9} />{practice.duration}
            </span>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={14} className="text-white/20 mt-1" />
          </motion.div>
        </div>

        {!isExpanded && (
          <p className="text-xs text-white/40 mt-2 leading-relaxed line-clamp-2 pl-12">
            {practice.description}
          </p>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <p className="text-xs text-white/60 leading-relaxed mb-4">{practice.description}</p>
              <div className="space-y-2.5">
                {practice.steps.map((s, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-semibold mt-0.5"
                      style={{ background: `${levelColor}20`, color: levelColor, border: `1px solid ${levelColor}30` }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed flex-1">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

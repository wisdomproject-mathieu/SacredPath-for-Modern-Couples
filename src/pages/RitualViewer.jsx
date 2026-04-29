import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight, Check, Clock, Zap, BookOpen } from 'lucide-react'
import { RITUALS, THEMES } from '../data/rituals'

export default function RitualViewer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const ritual = RITUALS.find(r => r.id === Number(id))
  const [activeStep, setActiveStep] = useState(null)
  const [completed, setCompleted] = useState(new Set())

  if (!ritual) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white/40 mb-4">Ritual not found</p>
          <button onClick={() => navigate('/library')} className="btn-ghost text-sm">
            Return to Library
          </button>
        </div>
      </div>
    )
  }

  const theme = THEMES.find(t => t.id === ritual.theme)
  const allComplete = completed.size === ritual.steps.length

  const toggleStep = (i) => {
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
    setActiveStep(i === activeStep ? null : i)
  }

  const progress = Math.round((completed.size / ritual.steps.length) * 100)

  return (
    <div className="min-h-screen pb-32">
      {/* Hero */}
      <div
        className="relative px-4 pt-12 pb-8"
        style={{ background: `linear-gradient(180deg, ${theme?.color}12 0%, transparent 100%)` }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs px-3 py-1 rounded-full border"
              style={{ borderColor: `${theme?.color}40`, color: theme?.color, background: `${theme?.color}10` }}
            >
              {theme?.icon} {theme?.label}
            </span>
            <span className="text-xs text-white/30 flex items-center gap-1">
              <Clock size={10} /> {ritual.duration}
            </span>
            <span className="text-xs text-white/30 flex items-center gap-1">
              <Zap size={10} /> {ritual.intensity}
            </span>
          </div>

          <h1 className="text-3xl font-serif font-medium mb-3 glow-text leading-snug">
            {ritual.title}
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">{ritual.description}</p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/40 uppercase tracking-widest">Progress</span>
          <span className="text-xs text-copper">{completed.size}/{ritual.steps.length} steps</span>
        </div>
        <div className="h-1.5 bg-charcoal-border rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${theme?.color} 0%, ${theme?.color}aa 100%)` }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 space-y-2 mb-6">
        <h2 className="text-xs text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
          <BookOpen size={12} />
          Steps
        </h2>
        {ritual.steps.map((step, i) => {
          const isDone = completed.has(i)
          const isActive = activeStep === i

          return (
            <motion.button
              key={i}
              layout
              onClick={() => toggleStep(i)}
              className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 ${
                isDone
                  ? 'border-copper/30 bg-copper/5'
                  : isActive
                  ? 'border-white/15 bg-charcoal-elevated'
                  : 'border-charcoal-border bg-charcoal-surface hover:border-white/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold mt-0.5 transition-all duration-200 ${
                    isDone
                      ? 'bg-copper text-charcoal'
                      : 'border border-charcoal-border text-white/30'
                  }`}
                >
                  {isDone ? <Check size={12} strokeWidth={3} /> : i + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-sm leading-relaxed transition-colors duration-200 ${
                    isDone ? 'text-white/50 line-through' : isActive ? 'text-white' : 'text-white/70'
                  }`}>
                    {step}
                  </p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Completion */}
      <AnimatePresence>
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4"
          >
            <div
              className="rounded-2xl p-6 text-center border"
              style={{
                background: `linear-gradient(135deg, ${theme?.color}15 0%, transparent 100%)`,
                borderColor: `${theme?.color}30`,
              }}
            >
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-xl font-serif font-medium mb-2">Ritual Complete</h3>
              <p className="text-sm text-white/50 mb-5">
                Take a moment to rest in the presence you've created together.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCompleted(new Set())
                    setActiveStep(null)
                  }}
                  className="flex-1 btn-ghost text-sm"
                >
                  Repeat
                </button>
                <button
                  onClick={() => navigate('/library')}
                  className="flex-1 btn-primary text-sm"
                >
                  Explore More
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related */}
      {!allComplete && (
        <div className="px-4 mt-6">
          <button
            onClick={() => navigate('/library')}
            className="w-full btn-ghost text-sm flex items-center justify-center gap-2"
          >
            <span>Browse Full Library</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

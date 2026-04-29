import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Send, Trash2, Sparkles, Lock } from 'lucide-react'
import { usePlan } from '../context/PlanContext'
import PaywallSheet from '../components/PaywallSheet'

const FREE_ENTRY_LIMIT = 5

const STORAGE_KEY = 'sacred-thread-v1'

const PROMPTS = [
  'One thing I love about you that I rarely say out loud…',
  'A moment from this week I want you to know meant something to me…',
  'Something I appreciate about how you showed up recently…',
  'A quality in you I want to celebrate today…',
  'One way you made me feel safe this week…',
  'Something I noticed about you that made me smile…',
  'A dream I have for us that I want to put into words…',
  "The thing about you that I'm most grateful for right now\u2026",
]

function getPrompt() {
  const day = new Date().getDay()
  return PROMPTS[day % PROMPTS.length]
}

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export default function Thread() {
  const { isPremium } = usePlan()
  const [entries, setEntries] = useState(loadEntries)
  const [draft, setDraft] = useState('')
  const [author, setAuthor] = useState('A')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const textareaRef = useRef(null)
  const prompt = getPrompt()
  const atLimit = !isPremium && entries.length >= FREE_ENTRY_LIMIT

  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  const submit = () => {
    const text = draft.trim()
    if (!text) return
    if (atLimit) { setPaywallOpen(true); return }
    const entry = {
      id: Date.now(),
      text,
      author,
      ts: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setDraft('')
    textareaRef.current?.blur()
  }

  const remove = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    setDeleteConfirm(null)
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen pb-32 pt-12">
      {/* Header */}
      <div className="px-4 mb-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-copper/60 uppercase tracking-[0.3em] mb-1">Your</p>
          <h1 className="text-3xl font-serif font-medium glow-text">Love Thread</h1>
          <p className="text-sm text-white/40 mt-1">A living record of what you love about each other.</p>
        </motion.div>
      </div>

      {/* Daily Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-4 mb-5"
      >
        <div
          className="rounded-2xl border px-4 py-4"
          style={{ borderColor: '#d1a07b20', background: '#d1a07b08' }}
        >
          <p className="text-xs text-copper/60 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Sparkles size={10} className="text-copper" />
            Today's prompt
          </p>
          <p className="text-sm text-white/70 leading-relaxed italic">"{prompt}"</p>
        </div>
      </motion.div>

      {/* Composer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mx-4 mb-6"
      >
        <div className="rounded-2xl border border-charcoal-border bg-charcoal-surface overflow-hidden">
          {/* Partner toggle */}
          <div className="flex border-b border-charcoal-border">
            {['A', 'B'].map(p => (
              <button
                key={p}
                onClick={() => setAuthor(p)}
                className={`flex-1 py-2.5 text-xs font-medium transition-all duration-200 ${
                  author === p ? 'text-copper bg-copper/8' : 'text-white/30 hover:text-white/60'
                }`}
              >
                Partner {p}
              </button>
            ))}
          </div>

          <textarea
            ref={textareaRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Write something..."
            rows={3}
            className="w-full bg-transparent text-sm text-white placeholder-white/25 outline-none px-4 pt-3 pb-2 resize-none leading-relaxed"
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
            }}
          />

          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-xs text-white/20">
              {atLimit ? `${FREE_ENTRY_LIMIT}/${FREE_ENTRY_LIMIT} entries used` : '⌘↵ to send'}
            </span>
            <button
              onClick={submit}
              disabled={!draft.trim()}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
                draft.trim()
                  ? 'bg-copper text-charcoal shadow-glow'
                  : 'bg-charcoal-elevated text-white/20 cursor-not-allowed'
              }`}
            >
              {atLimit ? <Lock size={11} /> : <Send size={11} />}
              {atLimit ? 'Unlock' : 'Send'}
            </button>
          </div>
        </div>

        {/* Free limit nudge */}
        {atLimit && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-2xl border border-copper/20 bg-copper/05 px-4 py-3 flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-xs font-medium text-copper">Thread limit reached</p>
              <p className="text-xs text-white/40 mt-0.5">Upgrade to keep writing — unlimited entries.</p>
            </div>
            <button
              onClick={() => setPaywallOpen(true)}
              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-copper text-charcoal shadow-glow"
            >
              Unlock
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Entries */}
      <div className="px-4 space-y-3">
        {entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Heart size={28} className="text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">Your thread starts here.</p>
            <p className="text-xs text-white/20 mt-1">Every message becomes part of your story.</p>
          </motion.div>
        )}

        <AnimatePresence>
          {entries.map(entry => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="rounded-2xl border p-4 relative group"
                style={{
                  borderColor: entry.author === 'A' ? '#d1a07b22' : '#8b7cf622',
                  background: entry.author === 'A' ? '#d1a07b08' : '#8b7cf608',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: entry.author === 'A' ? '#d1a07b20' : '#8b7cf620',
                          color: entry.author === 'A' ? '#d1a07b' : '#8b7cf6',
                        }}
                      >
                        Partner {entry.author}
                      </span>
                      <span className="text-[10px] text-white/25">{formatDate(entry.ts)}</span>
                    </div>
                    <p className="text-sm text-white/75 leading-relaxed">{entry.text}</p>
                  </div>

                  {deleteConfirm === entry.id ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => remove(entry.id)}
                        className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(entry.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white/50 flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {entries.length > 0 && (
          <p className="text-center text-xs text-white/15 py-4">
            {entries.length}{!isPremium ? `/${FREE_ENTRY_LIMIT}` : ''} {entries.length === 1 ? 'message' : 'messages'} in your thread
          </p>
        )}
      </div>

      <PaywallSheet isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  )
}

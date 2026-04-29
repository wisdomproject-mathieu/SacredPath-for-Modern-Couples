import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Check } from 'lucide-react'
import { usePlan } from '../context/PlanContext'

const PERKS = [
  'Active & extended practices (L2 + L3)',
  'Full library of 81 rituals',
  'Unlimited Love Thread entries',
  'New practices added every month',
]

export default function PaywallSheet({ isOpen, onClose }) {
  const { unlock } = usePlan()

  const handleUnlock = () => {
    unlock()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
          >
            <div
              className="w-full max-w-md rounded-t-3xl overflow-hidden"
              style={{ background: '#1a171c', borderTop: '1px solid #2e2831' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="px-6 pt-4 pb-10">
                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-charcoal-elevated flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
                >
                  <X size={15} />
                </button>

                {/* Icon + headline */}
                <div className="text-center mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
                    style={{ background: 'linear-gradient(135deg, #d1a07b20 0%, #8b7cf620 100%)', border: '1px solid #d1a07b30' }}
                  >
                    ✨
                  </div>
                  <h2 className="text-2xl font-serif font-medium glow-text mb-2">Sacred Path</h2>
                  <p className="text-sm text-white/50 leading-relaxed">
                    The complete practice library — every depth, every territory.
                  </p>
                </div>

                {/* Perks */}
                <div className="space-y-3 mb-6">
                  {PERKS.map((perk, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{ background: '#d1a07b20', border: '1px solid #d1a07b40' }}
                      >
                        <Check size={11} style={{ color: '#d1a07b' }} strokeWidth={2.5} />
                      </div>
                      <p className="text-sm text-white/70">{perk}</p>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div
                  className="rounded-2xl p-4 mb-5 text-center"
                  style={{ background: '#241f27', border: '1px solid #2e2831' }}
                >
                  <p className="text-3xl font-serif font-medium text-white mb-0.5">
                    $9.99
                    <span className="text-base font-sans font-normal text-white/40"> / month</span>
                  </p>
                  <p className="text-xs text-white/30">Or $59.99 / year — save 50%</p>
                </div>

                {/* CTA */}
                <button
                  onClick={handleUnlock}
                  className="w-full btn-primary py-4 text-base font-semibold flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  Unlock Sacred Path
                </button>

                <p className="text-center text-xs text-white/25 mt-3">
                  Cancel anytime · Secure checkout
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

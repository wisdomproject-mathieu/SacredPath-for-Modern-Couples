import { NavLink } from 'react-router-dom'
import { Home, CloudSun, BookOpen, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/weather', icon: CloudSun, label: 'Weather' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/thread', icon: Heart, label: 'Thread' },
]

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
      <div className="mx-4 mb-4 w-full max-w-sm">
        <div className="card flex items-center justify-around px-2 py-3 shadow-glow-md backdrop-blur-xl bg-charcoal-surface/90">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-copper' : 'text-white/40 hover:text-white/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="nav-glow"
                        className="absolute inset-0 -m-2 rounded-xl bg-copper/10"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon size={20} strokeWidth={isActive ? 2 : 1.5} className="relative z-10" />
                  </div>
                  <span className="text-[10px] font-medium tracking-wide">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

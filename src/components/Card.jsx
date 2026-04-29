import { motion } from 'framer-motion'

export function Card({ children, className = '', glow = false, onClick }) {
  const base = `card ${glow ? 'shadow-glow' : ''} ${className}`
  if (onClick) {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={`${base} w-full text-left cursor-pointer hover:border-copper/30 transition-colors duration-200`}
      >
        {children}
      </motion.button>
    )
  }
  return <div className={base}>{children}</div>
}

export function CardElevated({ children, className = '', onClick }) {
  const base = `card-elevated ${className}`
  if (onClick) {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={`${base} w-full text-left cursor-pointer hover:border-copper/30 transition-colors duration-200`}
      >
        {children}
      </motion.button>
    )
  }
  return <div className={base}>{children}</div>
}

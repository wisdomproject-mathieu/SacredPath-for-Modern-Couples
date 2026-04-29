import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navigation from './components/Navigation'
import { PlanProvider } from './context/PlanContext'
import Home from './pages/Home'
import Weather from './pages/Weather'
import Library from './pages/Library'
import RitualViewer from './pages/RitualViewer'
import Thread from './pages/Thread'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const pageTransition = {
  duration: 0.25,
  ease: [0.4, 0, 0.2, 1],
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/library" element={<Library />} />
          <Route path="/ritual/:id" element={<RitualViewer />} />
          <Route path="/ritual" element={<Library />} />
          <Route path="/thread" element={<Thread />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <PlanProvider>
        <div className="max-w-md mx-auto relative min-h-screen">
          <AnimatedRoutes />
          <Navigation />
        </div>
      </PlanProvider>
    </BrowserRouter>
  )
}

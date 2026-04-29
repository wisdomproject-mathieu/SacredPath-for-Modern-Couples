import { createContext, useContext, useState } from 'react'

const PlanContext = createContext(null)

const STORAGE_KEY = 'sacred-plan-v1'

function loadPlan() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'premium'
  } catch {
    return false
  }
}

export function PlanProvider({ children }) {
  const [isPremium, setIsPremium] = useState(loadPlan)

  const unlock = () => {
    localStorage.setItem(STORAGE_KEY, 'premium')
    setIsPremium(true)
  }

  const downgrade = () => {
    localStorage.removeItem(STORAGE_KEY)
    setIsPremium(false)
  }

  return (
    <PlanContext.Provider value={{ isPremium, unlock, downgrade }}>
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan() {
  return useContext(PlanContext)
}

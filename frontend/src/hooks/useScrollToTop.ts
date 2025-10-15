import { useEffect } from 'react'

export const useScrollToTop = (dependency?: unknown) => {
  useEffect(() => {
    // Immediate scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'instant' })
    
    // Then smooth scroll to ensure we're at the very top
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }, [dependency])
}

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'instant' })
}

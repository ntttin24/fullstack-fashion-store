'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cart'
import { Check } from 'lucide-react'

export default function MiniToast() {
  const { justAdded } = useCartStore()
  const [visible, setVisible] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (justAdded) {
      setVisible(true)
      setFadeOut(false)
      
      // Start fade out animation before hiding
      const fadeTimer = setTimeout(() => {
        setFadeOut(true)
      }, 2200)
      
      // Hide completely
      const hideTimer = setTimeout(() => {
        setVisible(false)
      }, 2500)
      
      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(hideTimer)
      }
    } else {
      setVisible(false)
      setFadeOut(false)
    }
  }, [justAdded])

  if (!visible) return null

  return (
    <div className={`fixed top-20 right-6 z-50 transition-opacity duration-300 ${
      fadeOut ? 'opacity-0 animate-fade-out' : 'opacity-100 animate-mini-toast-in'
    }`}>
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border border-white/20 backdrop-blur-sm">
        <div className="bg-white/20 rounded-full p-1">
          <Check size={16} strokeWidth={3} />
        </div>
        <span className="text-sm font-semibold">Đã thêm vào giỏ</span>
      </div>
    </div>
  )
}


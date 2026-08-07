'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
    >
      {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
    </button>
  )
}
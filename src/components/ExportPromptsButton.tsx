'use client'

import { useState } from 'react'

interface Prompt {
  id: string
  title: string
  content: string
  tags: string[] | null
  created_at: string
}

export function ExportPromptsButton({ prompts }: { prompts: Prompt[] }) {
  const [isOpen, setIsOpen] = useState(false)

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(prompts, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `promptify_prompts_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    setIsOpen(false)
  }

  const exportAsCSV = () => {
    const headers = ['ID', 'Título', 'Conteúdo', 'Tags', 'Data']
    const rows = prompts.map((p) => [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.content.replace(/"/g, '""')}"`,
      `"${p.tags ? p.tags.join(';') : ''}"`,
      `"${p.created_at}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', encodeURIComponent(csvContent))
    downloadAnchor.setAttribute('download', `promptify_prompts_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    setIsOpen(false)
  }

  if (prompts.length === 0) return null

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
      >
        <span>📥 Exportar ({prompts.length})</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-30">
          <button
            onClick={exportAsJSON}
            className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            Ficheiro JSON
          </button>
          <button
            onClick={exportAsCSV}
            className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            Ficheiro CSV (Excel)
          </button>
        </div>
      )}
    </div>
  )
}
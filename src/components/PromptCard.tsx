'use client'

import { useState } from 'react'
import { deletePrompt } from '@/app/actions/prompts'

export function PromptCard({
  prompt,
}: {
  prompt: { id: string; title: string; content: string; tags: string[] }
}) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (confirm('Tens a certeza que queres apagar este prompt?')) {
      setDeleting(true)
      await deletePrompt(prompt.id)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left flex flex-col justify-between hover:border-slate-700 transition-colors">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-slate-100 text-base">{prompt.title}</h3>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            title="Eliminar Prompt"
          >
            {deleting ? '...' : '🗑️'}
          </button>
        </div>

        <p className="text-slate-400 text-xs line-clamp-4 bg-slate-950/50 p-3 rounded-lg font-mono border border-slate-800/60 mb-4 whitespace-pre-wrap">
          {prompt.content}
        </p>
      </div>

      <div>
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {prompt.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleCopy}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          {copied ? (
            <span className="text-emerald-400">✓ Copiado!</span>
          ) : (
            <span>📋 Copiar Prompt</span>
          )}
        </button>
      </div>
    </div>
  )
}
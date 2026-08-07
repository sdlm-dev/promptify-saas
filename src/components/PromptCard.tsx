'use client'

import { useState, useEffect } from 'react'
import { deletePrompt, toggleFavoritePrompt } from '@/app/actions/prompts'
import { EditPromptModal } from '@/components/EditPromptModal'

interface Prompt {
  id: string
  title: string
  content: string
  tags: string[] | null
  created_at: string
  is_favorite?: boolean
}

export function PromptCard({
  prompt,
  isPro = false,
}: {
  prompt: Prompt
  isPro?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isFavorite, setIsFavorite] = useState(prompt.is_favorite || false)

  useEffect(() => {
    setIsFavorite(prompt.is_favorite || false)
  }, [prompt.is_favorite])

  const handleToggleFavorite = async () => {
    const nextState = !isFavorite
    setIsFavorite(nextState)

    try {
      await toggleFavoritePrompt(prompt.id, nextState)
    } catch (err) {
      setIsFavorite(isFavorite)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (confirm('Tens a certeza que queres eliminar este prompt?')) {
      setDeleting(true)
      try {
        await deletePrompt(prompt.id)
      } catch (err) {
        alert('Erro ao eliminar o prompt.')
        setDeleting(false)
      }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
            {prompt.title}
          </h3>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToggleFavorite}
              className="text-sm p-1 hover:scale-110 transition-transform"
              title={isFavorite ? 'Remover dos Favoritos' : 'Marcar como Favorito'}
            >
              {isFavorite ? '⭐' : '☆'}
            </button>

            <button
              onClick={handleCopy}
              className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded transition-colors"
            >
              {copied ? '✓ Copiado!' : '📋 Copiar'}
            </button>

            <EditPromptModal prompt={prompt} isPro={isPro} />

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 p-1 rounded transition-colors disabled:opacity-50"
              title="Apagar Prompt"
            >
              🗑️
            </button>
          </div>
        </div>

        <p className="text-slate-700 dark:text-slate-400 text-xs font-mono bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800/60 whitespace-pre-wrap break-words mb-3">
          {prompt.content}
        </p>
      </div>

      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {prompt.tags.map((tag, index) => (
            <span
              key={index}
              className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 px-2 py-0.5 rounded-md"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
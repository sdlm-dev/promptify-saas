'use client'

import { useState } from 'react'
import { deletePrompt } from '@/app/actions/prompts'
import { EditPromptModal } from '@/components/EditPromptModal'

interface Prompt {
  id: string
  title: string
  content: string
  tags: string[] | null
  created_at: string
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm">
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-semibold text-slate-100 text-base">{prompt.title}</h3>
          
          {/* Ações: Copiar, Editar e Apagar */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2 py-1 rounded transition-colors"
            >
              {copied ? '✓ Copiado!' : '📋 Copiar'}
            </button>
            
            <EditPromptModal prompt={prompt} isPro={isPro} />

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-slate-500 hover:text-red-400 p-1 rounded transition-colors disabled:opacity-50"
              title="Apagar Prompt"
            >
              🗑️
            </button>
          </div>
        </div>

        <p className="text-slate-400 text-xs font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 whitespace-pre-wrap break-words mb-3">
          {prompt.content}
        </p>
      </div>

      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {prompt.tags.map((tag, index) => (
            <span
              key={index}
              className="text-[10px] bg-indigo-950/40 text-indigo-300 border border-indigo-900/50 px-2 py-0.5 rounded-md"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
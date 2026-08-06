'use client'

import { useState } from 'react'
import { updatePrompt } from '@/app/actions/prompts'
import { optimizePromptWithAI } from '@/app/actions/ai'

interface Prompt {
  id: string
  title: string
  content: string
  tags: string[] | null
}

export function EditPromptModal({
  prompt,
  isPro,
}: {
  prompt: Prompt
  isPro: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  
  const [title, setTitle] = useState(prompt.title)
  const [content, setContent] = useState(prompt.content)
  const [tags, setTags] = useState(prompt.tags ? prompt.tags.join(', ') : '')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    try {
      await updatePrompt(prompt.id, formData)
      setIsOpen(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleOptimize() {
    if (!content.trim()) {
      setError('Escreve uma ideia inicial no campo do conteúdo antes de otimizar.')
      return
    }

    setOptimizing(true)
    setError(null)

    try {
      const optimizedText = await optimizePromptWithAI(content)
      setContent(optimizedText)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setOptimizing(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs text-slate-400 hover:text-slate-200 p-1 rounded transition-colors"
        title="Editar Prompt"
      >
        ✏️ Editar
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-left">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Editar Prompt</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 text-xs bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg">
                {error}
              </div>
            )}

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Título
                </label>
                <input
                  name="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-400">
                    Conteúdo do Prompt
                  </label>
                  {isPro && (
                    <button
                      type="button"
                      onClick={handleOptimize}
                      disabled={optimizing}
                      className="text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {optimizing ? '✨ Otimizando...' : '✨ Otimizar com IA'}
                    </button>
                  )}
                </div>
                <textarea
                  name="content"
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Tags (separadas por vírgulas)
                </label>
                <input
                  name="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="React, Next.js, Frontend"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'A guardar...' : 'Guardar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
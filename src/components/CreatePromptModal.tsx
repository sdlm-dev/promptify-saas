'use client'

import { useState } from 'react'
import { createPrompt } from '@/app/actions/prompts'
import { optimizePromptWithAI } from '@/app/actions/ai'

export function CreatePromptModal({
  isPro,
  promptCount,
}: {
  isPro: boolean
  promptCount: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [content, setContent] = useState('')

  const isLimitReached = !isPro && promptCount >= 3

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    try {
      await createPrompt(formData)
      setIsOpen(false)
      setContent('')
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
    <div className="mb-8">
      {isLimitReached ? (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-sm text-center">
          ⚠️ Atingiste o limite de 3/3 prompts do plano Gratuito.{' '}
          <span className="font-semibold text-amber-200">
            Atualiza para PRO para criar prompts ilimitados.
          </span>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 mx-auto"
        >
          <span>+ Novo Prompt</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Criar Novo Prompt</h2>
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

            <form action={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Título
                </label>
                <input
                  name="title"
                  required
                  placeholder="Ex: Gerador de Componentes React Tailwind"
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
                  placeholder="Atua como um programador sénior e gera..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Tags (separadas por vírgulas)
                </label>
                <input
                  name="tags"
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
                  {loading ? 'A guardar...' : 'Guardar Prompt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
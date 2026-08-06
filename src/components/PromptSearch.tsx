'use client'

import { useState, useMemo } from 'react'
import { PromptCard } from '@/components/PromptCard'

interface Prompt {
  id: string
  title: string
  content: string
  tags: string[] | null
  created_at: string
  user_id: string
}

export function PromptSearch({ prompts }: { prompts: Prompt[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Extrair todas as tags únicas de todos os prompts
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>()
    prompts.forEach((prompt) => {
      prompt.tags?.forEach((tag) => tagsSet.add(tag.trim()))
    })
    return Array.from(tagsSet)
  }, [prompts])

  // Filtrar os prompts com base na pesquisa e na tag selecionada
  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTag = selectedTag
        ? prompt.tags?.some((t) => t.trim().toLowerCase() === selectedTag.toLowerCase())
        : true

      return matchesSearch && matchesTag
    })
  }, [prompts, searchTerm, selectedTag])

  return (
    <div className="space-y-6">
      {/* Barra de Pesquisa e Filtros de Tags */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Pesquisar por título ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-lg"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Chips de Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                selectedTag === null
                  ? 'bg-indigo-600 border-indigo-500 text-white font-medium'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              Todas
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  selectedTag === tag
                    ? 'bg-indigo-600 border-indigo-500 text-white font-medium'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Resultado da Grelha */}
      {filteredPrompts.length === 0 ? (
        <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
          <p className="text-slate-400 text-sm">Nenhum prompt encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrompts.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
        </div>
      )}
    </div>
  )
}
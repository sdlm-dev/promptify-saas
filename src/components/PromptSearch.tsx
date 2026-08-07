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
  is_favorite?: boolean
}

export function PromptSearch({
  prompts,
  isPro = false,
}: {
  prompts: Prompt[]
  isPro?: boolean
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>()
    prompts.forEach((prompt) => {
      prompt.tags?.forEach((tag) => tagsSet.add(tag.trim()))
    })
    return Array.from(tagsSet)
  }, [prompts])

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTag = selectedTag
        ? prompt.tags?.some((t) => t.trim().toLowerCase() === selectedTag.toLowerCase())
        : true

      const matchesFavorite = showOnlyFavorites ? prompt.is_favorite : true

      return matchesSearch && matchesTag && matchesFavorite
    })
  }, [prompts, searchTerm, selectedTag, showOnlyFavorites])

  return (
    <div className="space-y-6">
      {/* Barra de Pesquisa */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Pesquisar por título ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Chips de Tags e Favoritos */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              setSelectedTag(null)
              setShowOnlyFavorites(false)
            }}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              selectedTag === null && !showOnlyFavorites
                ? 'bg-indigo-600 border-indigo-500 text-white font-medium'
                : 'bg-white dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700'
            }`}
          >
            Todas
          </button>

          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors flex items-center gap-1 ${
              showOnlyFavorites
                ? 'bg-amber-500 border-amber-400 text-slate-950 font-semibold'
                : 'bg-white dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-amber-600 dark:text-amber-400 hover:border-slate-400 dark:hover:border-slate-700'
            }`}
          >
            ⭐ Favoritos
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setShowOnlyFavorites(false)
                setSelectedTag(selectedTag === tag ? null : tag)
              }}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                selectedTag === tag
                  ? 'bg-indigo-600 border-indigo-500 text-white font-medium'
                  : 'bg-white dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      {filteredPrompts.length === 0 ? (
        <div className="bg-white/50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Nenhum prompt encontrado com esses filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrompts.map((p) => (
            <PromptCard key={p.id} prompt={p} isPro={isPro} />
          ))}
        </div>
      )}
    </div>
  )
}
'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function createPrompt(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Utilizador não autenticado')
  }

  // 1. Verificar perfil e contagem de prompts do utilizador
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  const { count } = await supabase
    .from('prompts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // 2. Bloquear se utilizador Gratuito exceder limite de 3 prompts
  const isPro = profile?.is_pro ?? false
  const promptCount = count ?? 0

  if (!isPro && promptCount >= 3) {
    throw new Error('Atingiste o limite de 3 prompts do plano Gratuito. Atualiza para PRO!')
  }

  // 3. Obter dados do formulário
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const tagsInput = formData.get('tags') as string
  const tags = tagsInput ? tagsInput.split(',').map((t) => t.trim()) : []

  if (!title || !content) {
    throw new Error('Título e Conteúdo são obrigatórios')
  }

  // 4. Inserir na base de dados
  const { error } = await supabase.from('prompts').insert({
    user_id: user.id,
    title,
    content,
    tags,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
}

export async function deletePrompt(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/')
}

export async function updatePrompt(id: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Utilizador não autenticado')
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const tagsRaw = formData.get('tags') as string

  if (!title || !content) {
    throw new Error('Título e conteúdo são obrigatórios.')
  }

  const tags = tagsRaw
    ? tagsRaw
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    : []

  // Atualizar o prompt (o RLS do Supabase garante que o utilizador só edita o que lhe pertence)
  const { error } = await supabase
    .from('prompts')
    .update({
      title,
      content,
      tags,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Erro ao atualizar prompt:', error)
    throw new Error('Falha ao atualizar o prompt.')
  }

  revalidatePath('/')
}
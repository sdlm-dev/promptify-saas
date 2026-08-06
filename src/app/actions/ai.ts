'use server'

import { createClient } from '@/lib/supabase-server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function optimizePromptWithAI(rawPrompt: string) {
  const supabase = await createClient()

  // 1. Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Utilizador não autenticado')
  }

  // 2. Garantir que apenas utilizadores PRO usam esta funcionalidade
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  if (!profile?.is_pro) {
    throw new Error('A otimização por IA é uma funcionalidade exclusiva do plano PRO.')
  }

  if (!rawPrompt || rawPrompt.trim().length < 5) {
    throw new Error('Escreve pelo menos uma ideia simples para a IA poder otimizar.')
  }

  try {
    // 3. Gerar o prompt otimizado usando o modelo Llama 3 8B (gratuito e super rápido)
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'És um perito em Engenharia de Prompts (Prompt Engineering). A tua tarefa é pegar na ideia simples enviada pelo utilizador e reescrevê-la num prompt altamente estruturado, claro, profissional e eficaz para ser usado em LLMs (como ChatGPT ou Claude). Devolve APENAS o texto do prompt otimizado, sem saudações ou explicações adicionais.',
        },
        {
          role: 'user',
          content: rawPrompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
    })

    return completion.choices[0]?.message?.content || rawPrompt
  } catch (error: any) {
    console.error('❌ ERRO DETALHADO DA IA:', error)
    throw new Error(error?.message || 'Falha ao gerar o prompt com IA.')
  }
}
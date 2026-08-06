import { createClient } from '@/lib/supabase-server'
import { createCheckoutSession } from '@/app/actions/stripe'
import { createCustomerPortalSession } from '@/app/actions/stripe-portal'
import { CreatePromptModal } from '@/components/CreatePromptModal'
import { PromptCard } from '@/components/PromptCard'
import { LogoutButton } from '@/components/LogoutButton'
import { PromptSearch } from '@/components/PromptSearch'
import Link from 'next/link'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  let prompts: any[] = []

  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = profileData

    const { data: promptsData } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    prompts = promptsData || []
  }

  const params = await searchParams
  const isPro = profile?.is_pro ?? false

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navbar */}
        <header className="flex justify-between items-center mb-8 bg-slate-900 border border-slate-800 rounded-xl p-4 px-6 shadow-md">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Promptify
            </h1>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isPro
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isPro ? 'PLANO PRO ✨' : 'PLANO GRATUITO'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {user ? (
              <>
                <span className="text-slate-400">{user.email}</span>
                
                {/* Se NÃO for PRO: Botão de Upgrade */}
                {!isPro ? (
                  <form action={createCheckoutSession}>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Upgradar para PRO (9.99€)
                    </button>
                  </form>
                ) : (
                  /* Se FOR PRO: Botão para abrir o Portal de Gestão */
                  <form action={createCustomerPortalSession}>
                    <button
                      type="submit"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span>⚙️ Gerir Subscrição</span>
                    </button>
                  </form>
                )}

                <LogoutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Iniciar Sessão
              </Link>
            )}
          </div>
        </header>

        {params.success && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm p-4 rounded-xl mb-6 text-center">
            🎉 Pagamento concluído com sucesso! A tua conta PRO foi ativada.
          </div>
        )}

        {!user ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-12">
            <h2 className="text-2xl font-bold mb-3">Organiza os teus Prompts de IA</h2>
            <p className="text-slate-400 text-sm mb-6">
              Guarda, categoriza e copia com 1 clique os teus melhores prompts para
              ChatGPT, Claude e Midjourney.
            </p>
            <Link
              href="/login"
              className="inline-block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Começar Grátis
            </Link>
          </div>
        ) : (
         <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Os Meus Prompts</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {prompts.length} {prompts.length === 1 ? 'prompt guardado' : 'prompts guardados'}
                  {!isPro && ` (Limite de 3 no plano Gratuito)`}
                </p>
              </div>

              <CreatePromptModal isPro={isPro} promptCount={prompts.length} />
            </div>

            {prompts.length === 0 ? (
              <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
                <p className="text-slate-400 text-sm mb-2">Ainda não guardaste nenhum prompt.</p>
                <p className="text-slate-500 text-xs">
                  Clica no botão acima para adicionar o teu primeiro prompt!
                </p>
              </div>
            ) : (
              /* Subscrição do bloco antigo pelo componente de pesquisa/grelha */
              <PromptSearch prompts={prompts} isPro={isPro}/>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
'use server'

import { createClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'

export async function createCustomerPortalSession() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Utilizador não autenticado')
  }

  // Obter o stripe_customer_id do perfil do utilizador
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    throw new Error('ID de cliente Stripe não encontrado')
  }

  // Criar a sessão no Portal do Cliente do Stripe
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
  })

  // Redirecionar o utilizador para a página do Stripe
  redirect(portalSession.url)
}
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const headerList = await headers()
  const signature = headerList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Assinatura Stripe ausente' }, { status: 400 })
  }

  let event: import('stripe').Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`❌ Erro Webhook: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as import('stripe').Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const userEmail = session.customer_details?.email || session.customer_email

    if (userId) {
      const { error } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          email: userEmail, // 👈 Adicionado para satisfazer a not-null constraint
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          is_pro: true,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error('❌ Erro ao atualizar profile no Supabase:', error)
      } else {
        console.log(`✅ Utilizador ${userId} promovido a PRO com sucesso!`)
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as import('stripe').Stripe.Subscription
    
    await supabaseAdmin
      .from('profiles')
      .update({
        is_pro: false,
        stripe_subscription_id: null,
      })
      .eq('stripe_subscription_id', subscription.id)
  }

  return NextResponse.json({ received: true })
}
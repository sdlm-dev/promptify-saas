'use server'

import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function createCheckoutSession() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID_PRO,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
    customer_email: user.email,
    metadata: {
      userId: user.id, // ID real do Supabase Auth
    },
  })

  if (session.url) {
    redirect(session.url)
  }
}
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY não está definida no .env.local')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
})
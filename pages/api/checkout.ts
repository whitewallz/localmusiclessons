// pages/api/checkout.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed')
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 500,
            recurring: { interval: 'month' },
            product_data: {
              name: 'LocalMusicLessons Teacher Subscription',
              description: 'Access to dashboard and student connections',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/dashboard?sub=success`,
      cancel_url: `${req.headers.origin}/subscribe?sub=cancel`,
    })

    res.status(200).json({ sessionId: session.id })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: 'Stripe session creation failed' })
  }
}

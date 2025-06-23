import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import { stripe } from '@/lib/stripe'
import admin from 'firebase-admin'

// Disable body parsing so Stripe can validate the raw body
export const config = {
  api: {
    bodyParser: false,
  },
}

// Initialize Firebase Admin (safely, only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // or use a service account if needed
  })
}

const firestore = admin.firestore()

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  const rawBody = await buffer(req)
  const sig = req.headers['stripe-signature'] as string

  let event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle event types
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const firebaseUID = session.metadata?.firebaseUID

    if (firebaseUID) {
      // Mark user as subscribed in Firestore
      await firestore.collection('users').doc(firebaseUID).set(
        {
          subscribed: true,
          stripeCustomerId: session.customer,
        },
        { merge: true }
      )
    }
  }

  res.status(200).json({ received: true })
}

import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Subscribe() {
  const [loading, setLoading] = useState(false)

  async function handleSubscribe() {
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
      })
      const { sessionId } = await res.json()
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId })
    } catch (err) {
      alert('Failed to start subscription')
      setLoading(false)
    }
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Subscribe as a Teacher</h1>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Redirecting...' : 'Start $5/month Subscription'}
      </button>
    </main>
  )
}

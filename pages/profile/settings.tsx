// pages/profile/settings.tsx
import { useState, useEffect } from 'react'
import { auth, db } from '../../lib/firebase'
import { useRouter } from 'next/router'
import Alert from '../../components/Alert'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function Settings() {
  const [user, setUser] = useState(auth.currentUser)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.push('/login')
        return
      }
      setUser(u)

      // Load notification prefs and subscription status from Firestore
      try {
        const docRef = doc(db, 'teachers', u.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setEmailNotifications(data.emailNotifications ?? false)
          setSmsNotifications(data.smsNotifications ?? false)
          setSubscribed(data.subscribed ?? false)
        }
      } catch {
        setError('Failed to load settings.')
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!user) return

    try {
      await auth.currentUser?.updatePassword(password)
      setMessage('Password updated successfully.')
      setPassword('')
    } catch (err: any) {
      setError(err.message || 'Failed to update password.')
    }
  }

  async function handleSavePreferences() {
    if (!user) return
    setError(null)
    setMessage(null)
    try {
      const docRef = doc(db, 'teachers', user.uid)
      await setDoc(
        docRef,
        { emailNotifications, smsNotifications, subscribed },
        { merge: true }
      )
      setMessage('Settings saved successfully.')
    } catch {
      setError('Failed to save settings.')
    }
  }

  async function handleSubscription() {
    if (!user) return
    // You can implement your Stripe subscription flow here.
    // For demo, we just toggle subscribed state.

    // In real, create checkout session and redirect user to Stripe payment
    try {
      setError(null)
      setMessage(null)
      // Simulate async action
      setSubscribed((prev) => !prev)
      setMessage(
        subscribed
          ? 'You have unsubscribed successfully.'
          : 'You have subscribed successfully.'
      )
      // Save subscription status in Firestore
      await handleSavePreferences()
    } catch {
      setError('Failed to update subscription status.')
    }
  }

  async function handleLogout() {
    await auth.signOut()
    router.push('/')
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {error && <Alert type="error">{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}

      <form onSubmit={handleChangePassword} className="flex flex-col gap-4 mb-8">
        <label>
          Change Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            required
            className="w-full p-2 border rounded"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Update Password
        </button>
      </form>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
        <label className="flex items-center mb-2 space-x-3">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
          <span>Email Notifications</span>
        </label>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={smsNotifications}
            onChange={() => setSmsNotifications(!smsNotifications)}
          />
          <span>SMS Notifications</span>
        </label>
        <button
          onClick={handleSavePreferences}
          className="mt-4 bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          Save Preferences
        </button>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        <p className="mb-4">
          {subscribed
            ? 'You are currently subscribed for $5/month.'
            : 'You are not subscribed yet.'}
        </p>
        <button
          onClick={handleSubscription}
          className={`py-3 rounded text-white ${
            subscribed ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {subscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
      </section>

      <button
        onClick={handleLogout}
        className="bg-gray-700 text-white py-3 rounded hover:bg-gray-900 w-full"
      >
        Log Out
      </button>
    </main>
  )
}

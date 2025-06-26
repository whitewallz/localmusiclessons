import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import Alert from '../components/Alert'

export default function Contact() {
  const router = useRouter()
  const { to } = router.query

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    toTeacherId: typeof to === 'string' ? to : '',
  })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Update toTeacherId if query param changes
  useEffect(() => {
    if (typeof to === 'string') {
      setForm((f) => ({ ...f, toTeacherId: to }))
    }
  }, [to])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setAlert(null)

    if (!form.name || !form.email || !form.message || !form.toTeacherId) {
      setAlert({ type: 'error', message: 'Please fill out all fields.' })
      setLoading(false)
      return
    }

    try {
      await addDoc(collection(db, 'messages'), {
        toTeacherId: form.toTeacherId,
        name: form.name,
        email: form.email,
        message: form.message,
        read: false,
        createdAt: serverTimestamp(),
      })
      setAlert({ type: 'success', message: 'Message sent successfully!' })
      setForm((f) => ({ ...f, message: '' }))
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to send message. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Teacher</h1>

      {alert && (
        <Alert type={alert.type} className="mb-6">
          {alert.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={form.email}
          onChange={handleChange}
          required
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <textarea
          name="message"
          placeholder="Your message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </main>
  )
}

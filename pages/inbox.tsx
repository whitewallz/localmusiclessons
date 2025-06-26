import { useEffect, useState } from 'react'
import { auth, db } from '../lib/firebase'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'

type Message = {
  id: string
  name: string
  email: string
  message: string
  createdAt: any
}

export default function Inbox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setError('You must be logged in to view your inbox.')
        setLoading(false)
        return
      }
      setUserId(user.uid)

      const q = query(
        collection(db, 'messages'),
        where('toTeacherId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      const unsubscribeMessages = onSnapshot(
        q,
        (snapshot) => {
          const msgs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Message, 'id'>),
          }))
          setMessages(msgs)
          setLoading(false)
        },
        (err) => {
          setError('Failed to load messages.')
          setLoading(false)
        }
      )

      return () => unsubscribeMessages()
    })

    return () => unsubscribeAuth()
  }, [])

  if (loading) return <LoadingSpinner />

  if (error)
    return (
      <main className="max-w-xl mx-auto p-8">
        <Alert type="error">{error}</Alert>
      </main>
    )

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map(({ id, name, email, message, createdAt }) => (
            <li key={id} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">{name}</p>
                <time className="text-sm text-gray-500">
                  {createdAt?.toDate
                    ? createdAt.toDate().toLocaleString()
                    : 'Just now'}
                </time>
              </div>
              <p className="mb-2">{message}</p>
              <a
                href={`mailto:${email}`}
                className="text-indigo-600 hover:underline text-sm"
              >
                Reply to {email}
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}


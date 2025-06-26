import { useEffect, useState } from 'react'
import { auth, db } from '../lib/firebase'
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
} from 'firebase/firestore'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'

type Message = {
  id: string
  name: string
  email: string
  message: string
  createdAt: any
  read?: boolean
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

  async function toggleRead(id: string, currentRead: boolean | undefined) {
    if (!userId) return
    try {
      const messageRef = doc(db, 'messages', id)
      await updateDoc(messageRef, {
        read: !currentRead,
      })
    } catch {
      setError('Failed to update message status.')
    }
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map(({ id, name, email, message, createdAt, read }) => (
            <li
              key={id}
              className={`border p-4 rounded shadow-sm transition ${
                read ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">{name}</p>
                <time className="text-sm text-gray-500">
                  {createdAt?.toDate
                    ? createdAt.toDate().toLocaleString()
                    : 'Just now'}
                </time>
              </div>
              <p className="mb-2 whitespace-pre-wrap">{message}</p>
              <div className="flex justify-between items-center">
                <a
                  href={`mailto:${email}`}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Reply to {email}
                </a>
                <button
                  onClick={() => toggleRead(id, read)}
                  className={`text-sm px-3 py-1 rounded border ${
                    read
                      ? 'border-gray-400 text-gray-600 hover:bg-gray-200'
                      : 'border-indigo-600 text-indigo-600 hover:bg-indigo-100'
                  } transition`}
                >
                  {read ? 'Mark Unread' : 'Mark Read'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

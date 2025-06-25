import { useEffect, useState } from 'react'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/router'
import RequireAuth from '../components/RequireAuth'
import { getMessagesForTeacher } from '../lib/messages'
import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'

type Message = {
  id: string
  studentName: string
  studentEmail: string
  message: string
  createdAt: any
}

export default function Inbox() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMessages = async () => {
      const user = auth.currentUser
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const msgs = await getMessagesForTeacher(user.uid)
        setMessages(msgs)
      } catch (err) {
        setError('Failed to load messages.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [router])

  if (loading) return <LoadingSpinner />

  return (
    <RequireAuth>
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Inbox</h1>

        {error && <Alert type="error" message={error} />}

        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg) => (
              <Card key={msg.id}>
                <p>
                  <strong>From:</strong> {msg.studentName} ({msg.studentEmail})
                </p>
                <p className="mt-2 whitespace-pre-wrap">{msg.message}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {new Date(msg.createdAt?.seconds * 1000).toLocaleString()}
                </p>
              </Card>
            ))}
          </ul>
        )}
      </main>
    </RequireAuth>
  )
}

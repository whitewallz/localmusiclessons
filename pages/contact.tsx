import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import Alert from '../components/Alert'
import LoadingSpinner from '../components/LoadingSpinner'

type Teacher = {
  name: string
  instrument: string
  email: string
}

export default function ContactPage() {
  const router = useRouter()
  const { teacher: teacherId } = router.query
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'success' | 'error' | ''>('')

  useEffect(() => {
    if (teacherId) {
      const fetchTeacher = async () => {
        const docRef = doc(db, 'teachers', teacherId as string)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data() as Teacher
          setTeacher({ name: data.name, instrument: data.instrument, email: data.email })
        }
        setLoading(false)
      }
      fetchTeacher()
    }
  }, [teacherId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('')
    try {
      await addDoc(collection(db, 'messages'), {
        teacherId,
        teacherEmail: teacher?.email || '',
        studentName: form.name,
        studentEmail: form.email,
        message: form.message,
        createdAt: serverTimestamp(),
        read: false,
      })
      setForm({ name: '', email: '', message: '' })
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (loading) return <LoadingSpinner />
  if (!teacher) return <Alert type="error" message="Teacher not found." />

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Contact {teacher.name}</h1>
      <p className="text-gray-600 mb-6">Instrument: {teacher.instrument}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Your Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Your Email</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Message</label>
          <textarea
            rows={5}
            className="w-full border rounded p-2"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>

      {status === 'success' && (
        <div className="mt-4">
          <Alert type="success" message="Message sent successfully!" />
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4">
          <Alert type="error" message="Something went wrong. Please try again." />
        </div>
      )}
    </main>
  )
}


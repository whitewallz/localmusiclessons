import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import LoadingSpinner from '../../components/LoadingSpinner'
import Modal from '../../components/Modal'

type Teacher = {
  name: string
  instrument: string
  bio: string
  photoURL?: string
  email?: string
}

export default function TeacherProfile() {
  const router = useRouter()
  const { id } = router.query
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (id) {
      const fetchTeacher = async () => {
        try {
          const docRef = doc(db, 'teachers', id as string)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setTeacher(docSnap.data() as Teacher)
          } else {
            setTeacher(null)
          }
        } catch (err) {
          console.error('Error loading teacher:', err)
        } finally {
          setLoading(false)
        }
      }
      fetchTeacher()
    }
  }, [id])

  async function handleSend() {
  if (!id || !teacher) return

  try {
    await addDoc(collection(db, 'messages'), {
      teacherId: id,
      teacherName: teacher.name,
      studentName,
      studentEmail,
      message,
      createdAt: serverTimestamp(),
    })

    setSent(true)
    setTimeout(() => {
      setShowModal(false)
      setSent(false)
      setStudentName('')
      setStudentEmail('')
      setMessage('')
    }, 2000)
  } catch (err) {
    console.error('Error sending message:', err)
    alert('Failed to send message. Please try again later.')
  }
}
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (!teacher) {
    return (
      <main className="max-w-3xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Teacher not found</h1>
        <p className="text-gray-500 mt-2">Please check the URL or try browsing again.</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      {teacher.photoURL && (
        <div className="mb-6 flex justify-center">
          <img
            src={teacher.photoURL}
            alt={teacher.name}
            className="w-40 h-40 rounded-full object-cover shadow-lg"
          />
        </div>
      )}
      <h1 className="text-4xl font-bold mb-2">{teacher.name}</h1>
      <p className="text-xl italic text-gray-500 mb-6">{teacher.instrument}</p>
      <p className="text-lg leading-relaxed whitespace-pre-line mb-8">{teacher.bio}</p>

      <button
        onClick={() => setShowModal(true)}
        className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
      >
        Contact {teacher.name.split(' ')[0]}
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-2xl font-bold mb-4">Contact {teacher.name}</h2>
        {sent ? (
          <p className="text-green-600">Message sent! 🎉</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Your Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Your message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Send Message
            </button>
          </form>
        )}
      </Modal>
    </main>
  )
}

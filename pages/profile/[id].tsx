import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import LoadingSpinner from '../../components/LoadingSpinner'
import Link from 'next/link'

type Teacher = {
  name: string
  instrument: string
  bio: string
  photoURL?: string
  phone?: string
  pricing?: string
  lessonType?: 'In-person' | 'Online' | 'Both'
}

export default function TeacherProfile() {
  const router = useRouter()
  const { id } = router.query
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const fetchTeacher = async () => {
        const docRef = doc(db, 'teachers', id as string)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setTeacher(docSnap.data() as Teacher)
        }
        setLoading(false)
      }
      fetchTeacher()
    }
  }, [id])

  if (loading || !teacher) return <LoadingSpinner />

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
      <div className="flex flex-col items-center text-center space-y-4">
        {teacher.photoURL && (
          <img
            src={teacher.photoURL}
            alt={teacher.name}
            className="w-32 h-32 rounded-full object-cover shadow"
          />
        )}

        <h1 className="text-3xl font-bold">{teacher.name}</h1>
        <p className="text-lg italic text-gray-500">{teacher.instrument}</p>
      </div>

      <div className="mt-6 space-y-4 text-gray-800">
        {teacher.bio && (
          <p className="whitespace-pre-line leading-relaxed">{teacher.bio}</p>
        )}

        {teacher.phone && (
          <p>
            <strong>Phone:</strong>{' '}
            <a href={`tel:${teacher.phone}`} className="text-blue-600 underline">
              {teacher.phone}
            </a>
          </p>
        )}

        {teacher.pricing && (
          <p>
            <strong>Price:</strong> ${teacher.pricing}/hour
          </p>
        )}

        {teacher.lessonType && (
          <p>
            <strong>Lesson Type:</strong> {teacher.lessonType}
          </p>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href={`/contact?to=${id}`}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Contact Teacher
        </Link>
      </div>
    </main>
  )
}

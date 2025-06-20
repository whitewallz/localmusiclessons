import { useRouter } from 'next/router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useEffect, useState } from 'react'

type Teacher = {
  id: string
  name: string
  instrument: string
  bio: string
  email?: string
}

export default function TeacherProfile() {
  const router = useRouter()
  const { id } = router.query
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchTeacher() {
      const docRef = doc(db, 'teachers', id as string)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setTeacher({ id: docSnap.id, ...docSnap.data() } as Teacher)
      }
      setLoading(false)
    }
    fetchTeacher()
  }, [id])

  if (loading) return <p className="p-8">Loading profile...</p>
  if (!teacher) return <p className="p-8">Teacher not found.</p>

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">{teacher.name}</h1>
      <p className="italic text-lg mb-2">{teacher.instrument}</p>
      <p className="mb-4 whitespace-pre-line">{teacher.bio}</p>
      {teacher.email && (
        <p>
          Contact: <a href={`mailto:${teacher.email}`} className="text-blue-600 underline">{teacher.email}</a>
        </p>
      )}
    </main>
  )
}

// pages/profile/[id].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

type Teacher = {
  name: string
  instrument: string
  bio: string
}

export default function TeacherProfile() {
  const router = useRouter()
  const { id } = router.query
  const [teacher, setTeacher] = useState<Teacher | null>(null)

  useEffect(() => {
    if (id) {
      const fetchTeacher = async () => {
        const docRef = doc(db, 'teachers', id as string)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setTeacher(docSnap.data() as Teacher)
        }
      }
      fetchTeacher()
    }
  }, [id])

  if (!teacher) return <p className="p-8">Loading...</p>

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">{teacher.name}</h1>
      <p className="text-xl italic text-gray-400 mb-4">{teacher.instrument}</p>
      <p className="text-lg leading-relaxed">{teacher.bio}</p>
    </main>
  )
}

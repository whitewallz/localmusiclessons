import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import Link from 'next/link'

type Teacher = {
  id: string
  name: string
  instrument: string
  bio: string
}

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTeachers() {
      const snapshot = await getDocs(collection(db, 'teachers'))
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Teacher[]
      setTeachers(list)
      setLoading(false)
    }
    fetchTeachers()
  }, [])

  if (loading) return <p className="p-8">Loading teachers...</p>

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Music Teachers</h1>
      {teachers.length === 0 && <p>No teachers found. Please check back later.</p>}
      <ul className="space-y-4">
        {teachers.map(t => (
          <li key={t.id} className="p-4 border rounded hover:shadow">
            <Link href={`/profile/${t.id}`}>
              <a>
                <h2 className="text-2xl font-semibold">{t.name}</h2>
                <p className="italic">{t.instrument}</p>
                <p className="mt-2 line-clamp-3">{t.bio}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

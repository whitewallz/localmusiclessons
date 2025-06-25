import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
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
      const q = query(collection(db, 'teachers'), where('isApproved', '==', true))
      const snapshot = await getDocs(q)
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Teacher[]
      setTeachers(list)
      setLoading(false)
    }
    fetchTeachers()
  }, [])

  if (loading)
    return (
      <p className="p-8 text-center text-gray-300 bg-gray-900 min-h-screen">
        Loading teachers...
      </p>
    )

  return (
    <main className="max-w-5xl mx-auto p-8 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8">Music Teachers</h1>
      {teachers.length === 0 && (
        <p className="text-gray-400 text-center">No teachers found. Please check back later.</p>
      )}
      <ul className="space-y-6">
        {teachers.map((t) => (
          <li
            key={t.id}
            className="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-yellow-glow transition-shadow"
          >
            <h2 className="text-3xl font-bold text-white mb-2">{t.name}</h2>
            <p className="text-yellow-400 italic mb-4">{t.instrument}</p>
            <p className="text-gray-300 line-clamp-3">{t.bio}</p>
            <Link
              href="/contact"
              className="mt-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-6 rounded-full font-semibold uppercase tracking-wide transition"
            >
              Contact
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}




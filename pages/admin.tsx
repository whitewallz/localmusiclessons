import { useEffect, useState } from 'react'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db, auth } from '../lib/firebase'
import { useRouter } from 'next/router'

type Teacher = {
  id: string
  name: string
  instrument: string
  bio: string
  isApproved?: boolean
}

export default function Admin() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Replace with your admin user ID(s)
      const adminUIDs = ['YOUR_FIREBASE_ADMIN_UID']
      if (!user || !adminUIDs.includes(user.uid)) {
        router.push('/')
      }
    })
    return unsubscribe
  }, [router])

  useEffect(() => {
    async function fetchPending() {
      const snapshot = await getDocs(collection(db, 'teachers'))
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Teacher[]
      setTeachers(list)
      setLoading(false)
    }
    fetchPending()
  }, [])

  async function approve(id: string) {
    await updateDoc(doc(db, 'teachers', id), { isApproved: true })
    setTeachers(teachers.map(t => t.id === id ? { ...t, isApproved: true } : t))
  }

  async function remove(id: string) {
    await updateDoc(doc(db, 'teachers', id), { isApproved: false })
    setTeachers(teachers.map(t => t.id === id ? { ...t, isApproved: false } : t))
  }

  if (loading) return <p className="p-8">Loading admin panel...</p>

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Instrument</th>
            <th className="border border-gray-300 p-2">Approved</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id} className="text-center">
              <td className="border border-gray-300 p-2">{t.name}</td>
              <td className="border border-gray-300 p-2">{t.instrument}</td>
              <td className="border border-gray-300 p-2">{t.isApproved ? 'Yes' : 'No'}</td>
              <td className="border border-gray-300 p-2 space-x-2">
                {!t.isApproved && (
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => approve(t.id)}
                  >
                    Approve
                  </button>
                )}
                {t.isApproved && (
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => remove(t.id)}
                  >
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

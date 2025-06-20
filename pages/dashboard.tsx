import { useEffect, useState } from 'react'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [user, setUser] = useState(auth.currentUser)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (!u) {
        router.push('/login')
      } else {
        setUser(u)
      }
    })
    return unsubscribe
  }, [router])

  if (!user) return <p className="p-8">Loading...</p>

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>
      <p>This is your teacher dashboard (work in progress).</p>
    </main>
  )
}

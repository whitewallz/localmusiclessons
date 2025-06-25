import { useEffect, useState } from 'react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import LoadingSpinner from './LoadingSpinner'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login')
      } else {
        setUser(currentUser)
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  if (loading) return <LoadingSpinner />

  return <>{children}</>
}

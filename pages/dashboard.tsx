import { useEffect, useState } from 'react'
import { auth, db } from '../lib/firebase'
import { useRouter } from 'next/router'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'

type TeacherProfile = {
  name: string
  instrument: string
  bio: string
  email: string
  updatedAt?: any
}

export default function Dashboard() {
  const [user, setUser] = useState(auth.currentUser)
  const [profile, setProfile] = useState<TeacherProfile>({
    name: '',
    instrument: '',
    bio: '',
    email: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.push('/login')
      } else {
        setUser(u)
        // Fetch profile
        const docRef = doc(db, 'teachers', u.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProfile(docSnap.data() as TeacherProfile)
        } else {
          setProfile({ name: '', instrument: '', bio: '', email: u.email || '' })
        }
        setLoading(false)
      }
    })
    return unsubscribe
  }, [router])

  if (loading) return <p className="p-8">Loading...</p>

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const docRef = doc(db, 'teachers', user!.uid)
      await setDoc(
        docRef,
        {
          ...profile,
          email: user!.email,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      setMessage('Profile saved successfully!')
    } catch {
      setMessage('Failed to save profile.')
    }
    setSaving(false)
  }

  function updateField(field: keyof TeacherProfile, value: string) {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <label>
          Name
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </label>
        <label>
          Instrument
          <input
            type="text"
            value={profile.instrument}
            onChange={(e) => updateField('instrument', e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </label>
        <label>
          Bio
          <textarea
            value={profile.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            required
            rows={5}
            className="w-full p-2 border rounded"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </main>
  )
}
<button
  className="bg-blue-600 text-white py-3 px-6 rounded"
  onClick={async () => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: await auth.currentUser?.getIdToken() }),
    })
    const data = await res.json()
    window.location.href = data.url
  }}
>
  Subscribe for $5/month
</button>

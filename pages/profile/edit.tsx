// pages/profile/edit.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { auth, db, storage } from '../../lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import LoadingSpinner from '../../components/LoadingSpinner'
import Alert from '../../components/Alert'

type TeacherProfile = {
  name: string
  instrument: string
  bio: string
  email: string
  photoURL?: string
}

export default function EditProfile() {
  const [profile, setProfile] = useState<TeacherProfile>({
    name: '',
    instrument: '',
    bio: '',
    email: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.uid)

      try {
        const docRef = doc(db, 'teachers', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProfile(docSnap.data() as TeacherProfile)
        } else {
          setProfile({ name: '', instrument: '', bio: '', email: user.email || '' })
        }
      } catch {
        setError('Failed to load profile.')
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  function updateField(field: keyof TeacherProfile, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !userId) return
    setUploading(true)
    setError(null)
    try {
      const file = e.target.files[0]
      const storageRef = ref(storage, `profilePictures/${userId}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      setProfile((prev) => ({ ...prev, photoURL: url }))
    } catch {
      setError('Failed to upload image.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    if (!userId) {
      setError('No user logged in.')
      setSaving(false)
      return
    }

    try {
      const docRef = doc(db, 'teachers', userId)
      await setDoc(
        docRef,
        {
          ...profile,
          email: auth.currentUser?.email,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      setSuccess('Profile updated successfully!')
    } catch {
      setError('Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

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

        <label>
          Profile Picture
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {uploading && <p>Uploading...</p>}
          {profile.photoURL && (
            <img
              src={profile.photoURL}
              alt="Profile Picture"
              className="mt-2 w-24 h-24 rounded-full object-cover"
            />
          )}
        </label>

        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </main>
  )
}

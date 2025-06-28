import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { auth, db } from '../lib/firebase'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import Alert from '../components/Alert'
import LoadingSpinner from '../components/LoadingSpinner'
import NavigationLinks from '../components/NavigationLinks'

type TeacherProfile = {
  name: string
  instrument: string
  bio: string
  email: string
  photoURL?: string
  phone?: string
  pricing?: string
  lessonType?: 'In-person' | 'Online' | 'Both' | ''
   location?: {
    city: string
    state: string
    country: string
    lat: number
    lng: number
   }
}


export default function Dashboard() {
  const [user, setUser] = useState(auth.currentUser)
  const [profile, setProfile] = useState<TeacherProfile>({
    name: '',
    instrument: '',
    bio: '',
    email: '',
    phone: '',
    pricing: '',
    lessonType: '',
    location: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.push('/login')
      } else {
        setUser(u)
        try {
          const docRef = doc(db, 'teachers', u.uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setProfile(docSnap.data() as TeacherProfile)
          } else {
            setProfile({
              name: '',
              instrument: '',
              bio: '',
              email: u.email || '',
              phone: '',
              pricing: '',
              lessonType: '',
              location: '',
            })
          }
        } catch (err) {
          console.error('Error fetching profile:', err)
          setMessage({ type: 'error', text: 'Failed to load profile.' })
        }
        setLoading(false)
      }
    })
    return unsubscribe
  }, [router])

  if (loading) return <LoadingSpinner />

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    let photoURL = profile.photoURL

    try {
      if (file && user) {
        console.log('Uploading file:', file.name, file.size, file.type)
        const storage = getStorage()
        const fileRef = ref(storage, `teachers/${user.uid}/profile.jpg`)
        await uploadBytes(fileRef, file)
        photoURL = await getDownloadURL(fileRef)
        console.log('Upload successful, photoURL:', photoURL)
      }

      console.log('Saving profile data to Firestore...')
      await setDoc(
        doc(db, 'teachers', user!.uid),
        {
          ...profile,
          photoURL,
          email: user!.email,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      console.log('Profile saved successfully')
      setProfile((prev) => ({ ...prev, photoURL }))
      setMessage({ type: 'success', text: 'Profile saved successfully!' })
    } catch (err) {
      console.error('Save profile error:', err)
      setMessage({ type: 'error', text: 'Failed to save profile.' })
    }

    setSaving(false)
  }

  function updateField(field: keyof TeacherProfile, value: string) {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="sm:w-64 border-r bg-gray-50 p-4">
        <NavigationLinks />
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Your Teacher Dashboard</h1>
          {user && (
            <a
              href={`/profile/${user.uid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Preview Public Profile →
            </a>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {profile.photoURL && (
              <img
                src={profile.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div>
              <label className="block font-semibold mb-1">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Instrument */}
          <div className="space-y-1">
            <label className="block font-semibold">Instrument</label>
            <input
              type="text"
              value={profile.instrument}
              onChange={(e) => updateField('instrument', e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="block font-semibold">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              rows={4}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="block font-semibold">Phone Number</label>
            <input
              type="tel"
              value={profile.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="(123) 456-7890"
            />
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <label className="block font-semibold">Lesson Price ($/hour)</label>
            <input
              type="text"
              value={profile.pricing || ''}
              onChange={(e) => updateField('pricing', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g. 40"
            />
          </div>

          {/* Lesson Type */}
          <div className="space-y-1">
            <label className="block font-semibold">Lesson Type</label>
            <select
              value={profile.lessonType || ''}
              onChange={(e) =>
                updateField('lessonType', e.target.value as 'In-person' | 'Online' | 'Both' | '')
                 />
          </div>
            
                {/* Location */}
<div className="space-y-1">
  <label className="block font-semibold">Location</label>
  <input
    type="text"
    value={profile.location || ''}
    onChange={(e) => updateField('location', e.target.value)}
    className="w-full p-2 border rounded"
    placeholder="e.g. Seattle, WA"
  />
</div>

              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select type</option>
              <option value="In-person">In-person</option>
              <option value="Online">Online</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className={`w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 ${
              saving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        {message && (
          <div className="mt-4">
            <Alert type={message.type} message={message.text} />
          </div>
        )}
      </main>
    </div>
  )
}

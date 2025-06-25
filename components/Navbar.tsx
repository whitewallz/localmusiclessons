import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import Alert from './Alert'

type UserInfo = {
  name?: string
  email: string
  photoURL?: string
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [showLogoutAlert, setShowLogoutAlert] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName ?? '',
          email: firebaseUser.email ?? '',
          photoURL: firebaseUser.photoURL ?? '',
        })
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [])

  const toggleMenu = () => setMobileOpen(!mobileOpen)

  const handleLogout = async () => {
    await signOut(auth)
    setShowLogoutAlert(true)
    router.push('/')
  }

  const navLinks = (
    <>
      <Link href="/teachers" className="text-gray-700 hover:text-indigo-600">Browse Teachers</Link>
      <Link href="/subscribe" className="text-gray-700 hover:text-indigo-600">I'm a Teacher</Link>
      {user && (
        <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
      )}
    </>
  )

  return (
    <nav className="bg-white shadow-md px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          🎵 LocalMusicLessons
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex space-x-6 text-sm sm:text-base items-center">
          {navLinks}
          {user ? (
            <>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm text-gray-500">
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-gray-700 hover:text-indigo-600">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 space-y-3 px-4 text-sm">
          {navLinks}
          {user ? (
            <>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <span className="block text-sm text-gray-500">{user.name || user.email}</span>
              <button
                onClick={handleLogout}
                className="block text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="block text-gray-700 hover:text-indigo-600">
              Login
            </Link>
          )}
        </div>
      )}

      {/* Logout alert */}
      {showLogoutAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <Alert type="success" message="You've been logged out." />
        </div>
      )}
    </nav>
  )
}


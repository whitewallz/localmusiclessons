import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { auth } from '../lib/firebase'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<null | { photoURL?: string; email?: string }>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      setUser(u)
    })
    return unsubscribe
  }, [])

  const toggleMenu = () => setMobileOpen(!mobileOpen)

  const handleLogout = async () => {
    await auth.signOut()
    setUser(null)
  }

  return (
    <nav className="bg-white shadow-md px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          🎵 LocalMusicLessons
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6 text-sm sm:text-base">
          <Link href="/teachers" className="text-gray-700 hover:text-indigo-600">
            Browse Teachers
          </Link>

          {user ? (
            <>
              <Link href="/inbox" className="text-gray-700 hover:text-indigo-600">
                Inbox
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>

              {/* Profile pic if exists */}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-gray-500 text-sm">{user.email?.split('@')[0]}</span>
              )}

              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-indigo-600 px-3 py-1 border border-gray-300 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/subscribe" className="text-gray-700 hover:text-indigo-600">
                I'm a Teacher
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-indigo-600">
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden mt-4 space-y-3 px-4 text-sm">
          <Link href="/teachers" className="block text-gray-700 hover:text-indigo-600">
            Browse Teachers
          </Link>

          {user ? (
            <>
              <Link href="/inbox" className="block text-gray-700 hover:text-indigo-600">
                Inbox
              </Link>
              <Link href="/dashboard" className="block text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-1 border border-gray-300 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/subscribe" className="block text-gray-700 hover:text-indigo-600">
                I'm a Teacher
              </Link>
              <Link href="/login" className="block text-gray-700 hover:text-indigo-600">
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

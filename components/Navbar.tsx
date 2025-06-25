import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleMenu = () => setMobileOpen(!mobileOpen)

  return (
    <nav className="bg-white shadow-md px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          🎵 LocalMusicLessons
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 text-sm sm:text-base">
          <Link href="/teachers" className="text-gray-700 hover:text-indigo-600">Browse Teachers</Link>
          <Link href="/subscribe" className="text-gray-700 hover:text-indigo-600">I'm a Teacher</Link>
          <Link href="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden mt-4 space-y-3 px-4 text-sm">
          <Link href="/teachers" className="block text-gray-700 hover:text-indigo-600">Browse Teachers</Link>
          <Link href="/subscribe" className="block text-gray-700 hover:text-indigo-600">I'm a Teacher</Link>
          <Link href="/login" className="block text-gray-700 hover:text-indigo-600">Login</Link>
        </div>
      )}
    </nav>
  )
}

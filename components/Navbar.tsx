import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-indigo-600">
        <Link href="/">🎵 LocalMusicLessons</Link>
      </div>
      <div className="space-x-4">
        <Link href="/teachers" className="text-gray-700 hover:text-indigo-600">Browse Teachers</Link>
        <Link href="/subscribe" className="text-gray-700 hover:text-indigo-600">I'm a Teacher</Link>
        <Link href="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
      </div>
    </nav>
  )
}

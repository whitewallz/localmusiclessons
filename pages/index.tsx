import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4">Find Your Perfect Music Teacher</h1>
      <p className="text-lg mb-6 max-w-xl text-center">
        Browse qualified music teachers for every instrument. Sign up to teach or start your lesson search!
      </p>
      <div className="space-x-4">
        <Link href="/teachers">
          <a className="px-5 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Browse Teachers
          </a>
        </Link>
        <Link href="/login">
          <a className="px-5 py-3 bg-gray-300 rounded hover:bg-gray-400 transition">
            I’m a Teacher
          </a>
        </Link>
      </div>
    </main>
  )
}

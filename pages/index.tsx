import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 py-16">
      <h1 className="text-5xl font-extrabold tracking-wide text-white mb-6 max-w-3xl text-center">
        Find Your Perfect Music Teacher
      </h1>
      <p className="text-lg leading-relaxed text-gray-300 max-w-2xl text-center mb-10">
        Browse qualified music teachers for every instrument. Sign up to teach or start your lesson search!
      </p>
      <div className="flex space-x-12">
        <Link
          href="/teachers"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-full uppercase tracking-wide transition"
        >
          Browse Teachers
        </Link>
        <Link
          href="/login"
          className="inline-block bg-gray-800 hover:bg-gray-700 text-yellow-400 font-semibold py-3 px-8 rounded-full uppercase tracking-wide transition"
        >
          I’m a Teacher
        </Link>
      </div>
    </main>
  )
}

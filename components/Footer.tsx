import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-12 px-6 py-8 text-center text-sm text-gray-400 border-t">
      <nav className="mb-4 space-x-4">
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
        <Link href="/faq" className="hover:underline">
          FAQ
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms
        </Link>
        <Link href="/privacy" className="hover:underline">
          Privacy
        </Link>
      </nav>
      <p>© {new Date().getFullYear()} LocalMusicLessons. All rights reserved.</p>
    </footer>
  )
}

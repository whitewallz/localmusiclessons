import Navbar from './Navbar'
import Footer from './Footer'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 sm:px-8 md:px-12">{children}</main>
      <Footer />
    </>
  )
}

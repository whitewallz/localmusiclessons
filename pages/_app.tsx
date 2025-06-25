import Head from 'next/head'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main className="min-h-screen px-4 sm:px-8 md:px-12">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}

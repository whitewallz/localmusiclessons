import Head from 'next/head'
import '../styles/globals.css'
import 'leaflet/dist/leaflet.css'
import type { AppProps } from 'next/app'

import Layout from '../components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

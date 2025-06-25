// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Find your perfect music teacher. Browse qualified teachers for every instrument and start your lesson search today." />
        <meta name="author" content="Music Teacher Platform" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Music Teacher Platform" />
        <meta property="og:description" content="Find your perfect music teacher. Browse qualified teachers for every instrument and start your lesson search today." />
        <meta property="og:image" content="/og-image.png" /> {/* Replace with your image path */}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Music Teacher Platform" />
        <meta name="twitter:description" content="Find your perfect music teacher. Browse qualified teachers for every instrument and start your lesson search today." />
        <meta name="twitter:image" content="/og-image.png" /> {/* Replace with your image path */}

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

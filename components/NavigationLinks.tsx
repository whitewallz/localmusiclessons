// components/NavigationLinks.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

type NavigationLinksProps = {
  className?: string
}

export default function NavigationLinks({ className = '' }: NavigationLinksProps) {
  const router = useRouter()
  const currentPath = router.asPath

  const links = [
    { href: '/profile', label: 'Profile' },
    { href: '/profile/settings', label: 'Settings' },
    { href: '/inbox', label: 'Inbox' },
    { href: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <nav className={`flex flex-col space-y-3 text-sm ${className}`}>
      {links.map(({ href, label }) => {
        const active = currentPath === href
        return (
          <Link
            key={href}
            href={href}
            className={`block px-3 py-2 rounded ${
              active ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

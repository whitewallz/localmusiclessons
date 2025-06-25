export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = await (await import('./firebase')).auth.currentUser?.getIdToken()

  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || 'API request failed')
  }

  return res.json()
}

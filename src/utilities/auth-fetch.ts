type PayloadErrorBody = { errors?: { message: string }[]; message?: string }

export const authFetch = async (path: string, init?: RequestInit) => {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = (await res.json()) as PayloadErrorBody
      message = body.errors?.[0]?.message || body.message || message
    } catch {}
    throw new Error(message)
  }
  if (res.status === 204) return null
  return res.json()
}

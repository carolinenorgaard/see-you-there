'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { authFetch } from '@/utilities/auth-fetch'

type Me = {
  id: string
  name?: string
  email: string
  bio?: string
  age?: number
  zipCode?: string
  city?: string
}

export default function ProfileEditPage() {
  const router = useRouter()
  const [me, setMe] = useState<Me | null>(null)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [age, setAge] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await authFetch('/api/users/me')
        if (!data?.user) {
          router.push('/login')
          return
        }
        setMe(data.user)
        setName(data.user.name || '')
        setBio(data.user.bio || '')
        setAge(typeof data.user.age === 'number' ? String(data.user.age) : '')
        setZipCode(data.user.zipCode || '')
        setCity(data.user.city || '')
      } catch {
        router.push('/login')
      }
    })()
  }, [router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!me) return
    setError(null)
    setLoading(true)
    try {
      await authFetch(`/api/users/${me.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          bio,
          age: age === '' ? null : Number(age),
          zipCode,
          city,
        }),
      })
      router.push('/profile')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  if (!me) return <div className="container pt-24 pb-24">Loading…</div>

  return (
    <div className="container max-w-md pt-24 pb-24">
      <h1 className="text-3xl font-semibold mb-6">Edit profile</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <div className="flex gap-3">
          <label className="flex flex-col gap-1 w-24">
            <span className="text-sm">Age</span>
            <input
              type="number"
              min={0}
              max={130}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 w-28">
            <span className="text-sm">Zip code</span>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-sm">City</span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Bio</span>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  )
}

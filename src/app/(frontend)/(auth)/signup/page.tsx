'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { FormError } from '@/components/ui/form-error'
import { authFetch } from '@/utilities/auth-fetch'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Oprettelse mislykkedes')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="container max-w-md pt-24 pb-24">
        <h1 className="text-3xl font-semibold mb-4">Tjek din mail</h1>
        <p>
          Vi har sendt et bekræftelseslink til <strong>{email}</strong>. Klik på
          det for at aktivere din konto, og log derefter ind.
        </p>
        <Link href="/login" className="underline mt-4 inline-block">
          Tilbage til login
        </Link>
      </div>
    )
  }

  return (
    <div className="container max-w-md pt-24 pb-24">
      <h1 className="text-3xl font-semibold mb-6">Opret konto</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm">Navn</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Adgangskode</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <FormError message={error} />
        <Button type="submit" disabled={loading} className="self-start">
          {loading ? 'Opretter…' : 'Opret konto'}
        </Button>
      </form>
      <div className="mt-6 text-sm">
        <Link href="/login" className="underline">Har du allerede en konto? Log ind</Link>
      </div>
    </div>
  )
}

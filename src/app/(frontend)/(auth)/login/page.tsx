'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

import { Button } from '@/components/ui/button'
import { FormError } from '@/components/ui/form-error'
import { authFetch } from '@/utilities/auth-fetch'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const verified = params.get('verified') === '1'
  const redirectTo = params.get('redirect')
  const safeRedirect = redirectTo?.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/profile'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authFetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      router.push(safeRedirect)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login mislykkedes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {verified && (
        <p className="mb-4 text-success">Email bekræftet — du kan logge ind nu.</p>
      )}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <FormError message={error} />
        <Button type="submit" disabled={loading} className="self-start">
          {loading ? 'Logger ind…' : 'Log ind'}
        </Button>
      </form>
      <div className="mt-6 text-sm flex flex-col gap-1">
        <Link href="/signup" className="underline">Opret en konto</Link>
        <Link href="/forgot-password" className="underline">Glemt adgangskode?</Link>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="container pt-12 pb-16 md:pt-16">
      <div className="mx-auto max-w-md rounded-lg border border-border bg-card text-card-foreground p-8 shadow-sm">
        <h1 className="text-3xl font-semibold mb-6">Log ind</h1>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

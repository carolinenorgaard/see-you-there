'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

import { Button } from '@/components/ui/button'
import { FormError } from '@/components/ui/form-error'
import { authFetch } from '@/utilities/auth-fetch'

function ResetPasswordForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authFetch('/api/users/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      })
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nulstilling mislykkedes')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return <p>Manglende nulstillingstoken.</p>
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm">Ny adgangskode</span>
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
        {loading ? 'Gemmer…' : 'Opdater adgangskode'}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="container max-w-md pt-24 pb-24">
      <h1 className="text-3xl font-semibold mb-6">Nulstil adgangskode</h1>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}

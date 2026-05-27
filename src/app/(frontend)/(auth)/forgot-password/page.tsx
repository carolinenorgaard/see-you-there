'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { FormError } from '@/components/ui/form-error'
import { authFetch } from '@/utilities/auth-fetch'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authFetch('/api/users/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Anmodning mislykkedes')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="container max-w-md pt-24 pb-24">
        <h1 className="text-3xl font-semibold mb-4">Tjek din mail</h1>
        <p>Hvis der findes en konto for {email}, har vi sendt et link til nulstilling.</p>
      </div>
    )
  }

  return (
    <div className="container max-w-md pt-24 pb-24">
      <h1 className="text-3xl font-semibold mb-6">Glemt adgangskode</h1>
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
        <FormError message={error} />
        <Button type="submit" disabled={loading} className="self-start">
          {loading ? 'Sender…' : 'Send nulstillingslink'}
        </Button>
      </form>
    </div>
  )
}

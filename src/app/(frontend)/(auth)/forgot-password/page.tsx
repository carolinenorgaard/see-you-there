'use client'

import { useState } from 'react'

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
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="container max-w-md pt-24 pb-24">
        <h1 className="text-3xl font-semibold mb-4">Check your email</h1>
        <p>If an account exists for {email}, we sent a reset link.</p>
      </div>
    )
  }

  return (
    <div className="container max-w-md pt-24 pb-24">
      <h1 className="text-3xl font-semibold mb-6">Forgot password</h1>
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
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </div>
  )
}

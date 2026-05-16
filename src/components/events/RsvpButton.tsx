'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { authFetch } from '@/utilities/auth-fetch'

export function RsvpButton({
  eventId,
  initialAttending,
  loggedIn,
}: {
  eventId: string
  initialAttending: boolean
  loggedIn: boolean
}) {
  const router = useRouter()
  const [attending, setAttending] = useState(initialAttending)
  const [loading, setLoading] = useState(false)

  if (!loggedIn) {
    return (
      <a href="/login" className="inline-block bg-black text-white rounded px-4 py-2">
        Log in to attend
      </a>
    )
  }

  const toggle = async () => {
    setLoading(true)
    try {
      await authFetch(`/api/events/${eventId}/rsvp`, {
        method: attending ? 'DELETE' : 'POST',
      })
      setAttending(!attending)
      router.refresh()
    } catch {
      // swallow; UI stays in current state
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded px-4 py-2 ${attending ? 'bg-gray-200 text-black' : 'bg-black text-white'} disabled:opacity-50`}
    >
      {loading ? '…' : attending ? 'Cancel RSVP' : 'Attend'}
    </button>
  )
}

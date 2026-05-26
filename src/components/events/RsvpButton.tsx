'use client'

import { Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { authFetch } from '@/utilities/auth-fetch'

export function RsvpButton({
  eventId,
  initialAttending,
  loggedIn,
  iconOnly = false,
}: {
  eventId: string
  initialAttending: boolean
  loggedIn: boolean
  iconOnly?: boolean
}) {
  const router = useRouter()
  const [attending, setAttending] = useState(initialAttending)
  const [loading, setLoading] = useState(false)

  if (!loggedIn) {
    return (
      <a href="/login" className="inline-block bg-black text-white rounded px-4 py-2">
        Log ind for at deltage
      </a>
    )
  }

  const submit = async () => {
    setLoading(true)
    try {
      await authFetch(`/api/events/${eventId}/rsvp`, {
        method: attending ? 'DELETE' : 'POST',
      })
      setAttending(!attending)
      router.refresh()
    } catch (err) {
      console.error('RSVP toggle failed', err)
    } finally {
      setLoading(false)
    }
  }

  if (iconOnly) {
    const label = attending ? 'Annullér tilmelding' : 'Deltag'
    return (
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          submit()
        }}
        disabled={loading}
        aria-label={label}
        aria-pressed={attending}
        title={label}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm disabled:opacity-50 ${
          attending
            ? 'bg-black border-black text-white hover:bg-neutral-800'
            : 'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-100'
        }`}
      >
        {attending ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
      </button>
    )
  }

  return (
    <button
      onClick={submit}
      disabled={loading}
      className={`rounded px-4 py-2 ${attending ? 'bg-gray-200 text-black' : 'bg-black text-white'} disabled:opacity-50`}
    >
      {loading ? '…' : attending ? 'Annullér tilmelding' : 'Deltag'}
    </button>
  )
}

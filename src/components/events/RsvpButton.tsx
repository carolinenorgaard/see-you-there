'use client'

import { Check, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { authFetch } from '@/utilities/auth-fetch'
import { pillShapeClasses, togglePillClasses } from '@/utilities/togglePillClasses'
import { cn } from '@/utilities/ui'

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
      <Button asChild>
        <Link href="/login">Log ind for at deltage</Link>
      </Button>
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
        className={cn(pillShapeClasses(true), 'disabled:opacity-50', togglePillClasses(attending))}
      >
        {attending ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
      </button>
    )
  }

  return (
    <Button onClick={submit} disabled={loading} variant={attending ? 'secondary' : 'default'}>
      {loading ? '…' : attending ? 'Annullér tilmelding' : 'Deltag'}
    </Button>
  )
}

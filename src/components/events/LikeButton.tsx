'use client'

import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { authFetch } from '@/utilities/auth-fetch'

export function LikeButton({
  eventId,
  initialLiked,
  initialCount,
  loggedIn,
  showCount = true,
  iconOnly = false,
}: {
  eventId: string
  initialLiked: boolean
  initialCount: number
  loggedIn: boolean
  showCount?: boolean
  iconOnly?: boolean
}) {
  const router = useRouter()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  if (!loggedIn) {
    return (
      <a
        href="/login"
        aria-label="Log ind for at like denne begivenhed"
        className="inline-flex items-center gap-2 rounded px-3 py-2 border border-neutral-200 bg-white text-neutral-900"
      >
        <Heart className="h-4 w-4" />
        {showCount && <span>{count}</span>}
      </a>
    )
  }

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      await authFetch(`/api/events/${eventId}/like`, {
        method: liked ? 'DELETE' : 'POST',
      })
      setLiked(!liked)
      setCount((c) => c + (liked ? -1 : 1))
      router.refresh()
    } catch (err) {
      console.error('Like toggle failed', err)
    } finally {
      setLoading(false)
    }
  }

  if (iconOnly) {
    const label = liked ? 'Fjern like' : 'Like denne begivenhed'
    return (
      <button
        onClick={toggle}
        disabled={loading}
        aria-label={label}
        aria-pressed={liked}
        title={label}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm disabled:opacity-50 ${
          liked
            ? 'bg-pink-500 border-pink-500 text-white hover:bg-pink-600'
            : 'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-100'
        }`}
      >
        <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded px-3 py-2 border disabled:opacity-50 ${liked ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white text-black'}`}
      aria-pressed={liked}
    >
      <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
      {showCount && <span>{count}</span>}
    </button>
  )
}

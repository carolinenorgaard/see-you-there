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
}: {
  eventId: string
  initialLiked: boolean
  initialCount: number
  loggedIn: boolean
  showCount?: boolean
}) {
  const router = useRouter()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  if (!loggedIn) {
    return (
      <a
        href="/login"
        className="inline-flex items-center gap-2 rounded px-3 py-2 border bg-white"
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
    } catch {
      // swallow
    } finally {
      setLoading(false)
    }
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

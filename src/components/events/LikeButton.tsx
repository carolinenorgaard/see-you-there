'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { authFetch } from '@/utilities/auth-fetch'
import { pillShapeClasses, togglePillClasses } from '@/utilities/togglePillClasses'
import { cn } from '@/utilities/ui'

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

  const shape = pillShapeClasses(iconOnly)

  if (!loggedIn) {
    return (
      <Link
        href="/login"
        aria-label="Log ind for at like denne begivenhed"
        className={cn(shape, togglePillClasses(false))}
      >
        <Heart className="h-4 w-4" />
        {!iconOnly && showCount && <span>{count}</span>}
      </Link>
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

  const label = liked ? 'Fjern like' : 'Like denne begivenhed'

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={label}
      aria-pressed={liked}
      title={label}
      className={cn(shape, 'disabled:opacity-50', togglePillClasses(liked, 'pink'))}
    >
      <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
      {!iconOnly && showCount && <span>{count}</span>}
    </button>
  )
}

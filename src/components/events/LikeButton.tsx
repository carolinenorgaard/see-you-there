'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { authFetch } from '@/utilities/auth-fetch'
import { togglePillClasses } from '@/utilities/togglePillClasses'
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

  if (!loggedIn) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login" aria-label="Log ind for at like denne begivenhed">
          <Heart className="h-4 w-4" />
          {showCount && <span>{count}</span>}
        </Link>
      </Button>
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
      className={cn(
        'inline-flex items-center justify-center gap-2 border shadow-sm transition disabled:opacity-50',
        iconOnly ? 'h-9 w-9 rounded-full' : 'rounded-md px-3 py-2',
        togglePillClasses(liked, 'pink'),
      )}
    >
      <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
      {!iconOnly && showCount && <span>{count}</span>}
    </button>
  )
}

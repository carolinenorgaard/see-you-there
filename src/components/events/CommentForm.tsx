'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { authFetch } from '@/utilities/auth-fetch'

export function CommentForm({ eventId }: { eventId: string }) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setError(null)
    setLoading(true)
    try {
      await authFetch('/api/event-comments', {
        method: 'POST',
        body: JSON.stringify({ event: eventId, content }),
      })
      setContent('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <textarea
        rows={3}
        maxLength={2000}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment…"
        className="border rounded px-3 py-2"
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="bg-black text-white rounded px-4 py-2 self-start disabled:opacity-50"
      >
        {loading ? 'Posting…' : 'Post'}
      </button>
    </form>
  )
}

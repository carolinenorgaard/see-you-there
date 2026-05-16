'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { authFetch } from '@/utilities/auth-fetch'

type Option = { id: string; title: string }

const toISO = (date: string, time: string) => {
  if (!date) return null
  const t = time || '00:00'
  return new Date(`${date}T${t}:00`).toISOString()
}

export function NewEventForm({
  locations,
  categories,
}: {
  locations: Option[]
  categories: Option[]
}) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationId, setLocationId] = useState(locations[0]?.id ?? '')
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const toggleCategory = (id: string) =>
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await authFetch('/api/events', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          location: locationId,
          categories: categoryIds,
          startDate: toISO(startDate, '00:00'),
          endDate: toISO(endDate || startDate, '00:00'),
          startTime: toISO(startDate, startTime),
          endTime: toISO(endDate || startDate, endTime),
        }),
      })
      const slug = res?.doc?.slug
      if (slug) {
        router.push(`/events/${slug}`)
      } else {
        router.push('/events?source=community')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm">Title</span>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Description</span>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Location</span>
        <select
          required
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm">Categories</legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = categoryIds.includes(c.id)
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => toggleCategory(c.id)}
                className={`rounded-full px-3 py-1 text-sm border ${active ? 'bg-black text-white border-black' : 'bg-white text-black'}`}
              >
                {c.title}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm">Start date</span>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">End date</span>
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Start time</span>
          <input
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">End time</span>
          <input
            type="time"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || categoryIds.length === 0}
        className="bg-black text-white rounded px-4 py-2 self-start disabled:opacity-50"
      >
        {loading ? 'Submitting…' : 'Submit event'}
      </button>
    </form>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { FormError } from '@/components/ui/form-error'
import { authFetch } from '@/utilities/auth-fetch'
import { togglePillClasses } from '@/utilities/togglePillClasses'
import { cn } from '@/utilities/ui'

type Option = { id: string; title: string }

const toISO = (date: string, time: string) => {
  if (!date) return null
  const t = time || '00:00'
  return new Date(`${date}T${t}:00`).toISOString()
}

export function NewEventForm({
  locations,
  categories,
  lockLocation = false,
}: {
  locations: Option[]
  categories: Option[]
  lockLocation?: boolean
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
      setError(err instanceof Error ? err.message : 'Indsendelse mislykkedes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm">Titel</span>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Beskrivelse</span>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </label>

      {!lockLocation && (
        <label className="flex flex-col gap-1">
          <span className="text-sm">Lokation</span>
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
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm">Kategorier</legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = categoryIds.includes(c.id)
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => toggleCategory(c.id)}
                className={cn(
                  'rounded-full border px-3 py-1 text-sm transition',
                  togglePillClasses(active),
                )}
              >
                {c.title}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm">Startdato</span>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Slutdato</span>
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Starttidspunkt</span>
          <input
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Sluttidspunkt</span>
          <input
            type="time"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
      </div>

      <FormError message={error} />

      <Button type="submit" disabled={loading || categoryIds.length === 0} className="self-start">
        {loading ? 'Indsender…' : 'Indsend begivenhed'}
      </Button>
    </form>
  )
}

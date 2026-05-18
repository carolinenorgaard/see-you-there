'use client'

import { useQueryState } from 'nuqs'

import { Badge } from '@/components/ui/badge'
import type { Category } from '@/payload-types'
import { categoryColorClass } from '@/utilities/categoryColor'
import { cn } from '@/utilities/ui'
import { eventsFilterParsers } from './eventsFilters'

export const CategoryChipRow = ({ categories }: { categories: Category[] }) => {
  const [activeSlugs, setCategories] = useQueryState(
    'categories',
    eventsFilterParsers.categories,
  )

  const toggle = (slug: string) => {
    const next = activeSlugs.includes(slug)
      ? activeSlugs.filter((s) => s !== slug)
      : [...activeSlugs, slug]
    setCategories(next.length ? next : null)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => {
        if (!c.slug) return null
        const isActive = activeSlugs.includes(c.slug)
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => toggle(c.slug as string)}
            aria-pressed={isActive}
            className={cn(
              'rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30',
              !isActive && 'opacity-60 hover:opacity-100',
            )}
          >
            <Badge color={isActive ? categoryColorClass(c.color) : 'bg-neutral-200 !text-neutral-700'}>
              {c.title}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}

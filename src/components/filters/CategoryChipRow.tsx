'use client'

import { useQueryState } from 'nuqs'

import { Badge } from '@/components/ui/badge'
import type { Category } from '@/payload-types'
import { categoryColorClass } from '@/utilities/categoryColor'
import { cn } from '@/utilities/ui'

import { useFilterTransition } from './FilterTransitionContext'
import { categoriesParser } from './sharedFilterParsers'

export const CategoryChipRow = ({ categories }: { categories: Category[] }) => {
  const { startTransition } = useFilterTransition()
  const [activeSlugs, setCategories] = useQueryState(
    'categories',
    categoriesParser.withOptions({ startTransition }),
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
        const slug = c.slug
        if (!slug) return null
        const isActive = activeSlugs.includes(slug)
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => toggle(slug)}
            aria-pressed={isActive}
            className={cn(
              'cursor-pointer rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              !isActive && 'opacity-60 hover:opacity-100',
            )}
          >
            <Badge color={isActive ? categoryColorClass(c.color) : 'bg-muted !text-muted-foreground'}>
              {c.title}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}

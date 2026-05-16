import type { Category } from '@/payload-types'

export type CategoryColor = NonNullable<Category['color']>

const colorClasses: Record<CategoryColor, string> = {
  teal: 'bg-teal-600',
  pink: 'bg-pink-600',
  purple: 'bg-purple-400',
  orange: 'bg-orange-400',
  blue: 'bg-blue-700',
  amber: 'bg-amber-500',
}

const fallback = 'bg-neutral-700'

export const categoryColorClass = (color?: CategoryColor | null) =>
  (color && colorClasses[color]) ?? fallback

import type { Category } from '@/payload-types'

export type CategoryColor = NonNullable<Category['color']>

const colorClasses: Record<CategoryColor, string> = {
  teal: 'bg-category-teal text-category-foreground',
  pink: 'bg-category-pink text-category-foreground',
  purple: 'bg-category-purple text-category-foreground',
  orange: 'bg-category-orange text-category-foreground',
  blue: 'bg-category-blue text-category-foreground',
  amber: 'bg-category-amber text-category-foreground',
}

const fallback = 'bg-muted text-muted-foreground'

export const categoryColorClass = (color?: CategoryColor | null) =>
  (color && colorClasses[color]) ?? fallback

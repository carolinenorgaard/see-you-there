import type { CategoryColor } from './categoryColor'

export type TogglePillTone = 'primary' | CategoryColor

const activeByTone: Record<TogglePillTone, string> = {
  primary: 'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
  teal: 'border-category-teal bg-category-teal text-category-foreground hover:bg-category-teal/90',
  pink: 'border-category-pink bg-category-pink text-category-foreground hover:bg-category-pink/90',
  purple:
    'border-category-purple bg-category-purple text-category-foreground hover:bg-category-purple/90',
  orange:
    'border-category-orange bg-category-orange text-category-foreground hover:bg-category-orange/90',
  blue: 'border-category-blue bg-category-blue text-category-foreground hover:bg-category-blue/90',
  amber:
    'border-category-amber bg-category-amber text-category-foreground hover:bg-category-amber/90',
}

const inactive = 'border-border bg-background text-foreground hover:bg-accent'

export const togglePillClasses = (active: boolean, tone: TogglePillTone = 'primary') =>
  active ? activeByTone[tone] : inactive

export const pillShapeClasses = (iconOnly: boolean) =>
  `inline-flex items-center justify-center gap-2 border shadow-sm transition ${
    iconOnly ? 'h-9 w-9 rounded-full' : 'rounded-md px-3 py-2'
  }`

export type TogglePillTone = 'primary' | 'category-pink'

const activeByTone: Record<TogglePillTone, string> = {
  primary: 'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
  'category-pink':
    'border-category-pink bg-category-pink text-category-foreground hover:bg-category-pink/90',
}

const inactive = 'border-border bg-background text-foreground hover:bg-accent'

export const togglePillClasses = (active: boolean, tone: TogglePillTone = 'primary') =>
  active ? activeByTone[tone] : inactive

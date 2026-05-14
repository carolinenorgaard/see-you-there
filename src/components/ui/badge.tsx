import { cn } from '@/utilities/ui'
import * as React from 'react'

export type BadgeVariant = 'solid' | 'glass' | 'translucent' | 'outline'
export type BadgeSize = 'sm' | 'md'

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
  size?: BadgeSize
  /** Tailwind background-color class — only applied when variant is "solid" (e.g. "bg-teal-600"). */
  color?: string
  asChild?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  solid: 'text-white',
  glass: 'bg-white/70 text-black backdrop-blur-md',
  translucent: 'bg-white/20 text-white backdrop-blur-sm',
  outline: 'border border-white/40 text-white',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-3 py-1 text-[10px] tracking-[0.5px] uppercase',
  md: 'px-3 py-1.5 text-xs',
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'solid',
  size = 'sm',
  color,
  ...props
}) => {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(
        'inline-flex items-center rounded-full font-bold leading-none whitespace-nowrap',
        sizeClasses[size],
        variantClasses[variant],
        variant === 'solid' && (color ?? 'bg-neutral-900'),
        className,
      )}
      {...props}
    />
  )
}

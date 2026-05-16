'use client'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import * as React from 'react'

type CardRootProps = React.HTMLAttributes<HTMLElement> & {
  href?: string
  /** Aspect ratio of the card. Defaults to the Figma card ratio. */
  aspect?: string
}

const SeeYouThereCard: React.FC<CardRootProps> = ({
  className,
  href,
  aspect = 'aspect-[528/325]',
  children,
  ...props
}) => {
  const content = (
    <article
      data-slot="syt-card"
      className={cn(
        'group relative w-full overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-sm',
        aspect,
        className,
      )}
      {...props}
    >
      {children}
    </article>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {content}
      </Link>
    )
  }
  return content
}

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>

const SeeYouThereCardImage: React.FC<ImageProps> = ({ className, alt = '', ...props }) => (
  <img
    alt={alt}
    data-slot="syt-card-image"
    className={cn(
      'absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105',
      className,
    )}
    {...props}
  />
)

type OverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Strength of the dark gradient at the bottom. */
  intensity?: 'none' | 'soft' | 'strong'
}

const overlayIntensity: Record<NonNullable<OverlayProps['intensity']>, string> = {
  none: '',
  soft: 'bg-linear-to-t from-black/60 via-black/0 to-transparent',
  strong: 'bg-linear-to-t from-black/80 via-black/10 to-transparent',
}

const SeeYouThereCardOverlay: React.FC<OverlayProps> = ({
  className,
  intensity = 'strong',
  ...props
}) => (
  <div
    data-slot="syt-card-overlay"
    className={cn('absolute inset-0 pointer-events-none', overlayIntensity[intensity], className)}
    {...props}
  />
)

const SeeYouThereCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    data-slot="syt-card-header"
    className={cn(
      'absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-5',
      className,
    )}
    {...props}
  />
)

const SeeYouThereCardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    data-slot="syt-card-footer"
    className={cn(
      'absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5',
      className,
    )}
    {...props}
  />
)

const SeeYouThereCardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    data-slot="syt-card-body"
    className={cn('min-w-0 flex-1', className)}
    {...props}
  />
)

const SeeYouThereCardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h3
    data-slot="syt-card-title"
    className={cn(
      'mb-1 text-xl font-bold leading-tight tracking-tight md:text-2xl',
      className,
    )}
    {...props}
  />
)

const SeeYouThereCardMeta: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    data-slot="syt-card-meta"
    className={cn('flex items-center gap-1.5 text-sm text-white/90', className)}
    {...props}
  />
)

const SeeYouThereCardBadges: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { side?: 'left' | 'right' }
> = ({ className, side = 'left', ...props }) => (
  <div
    data-slot="syt-card-badges"
    data-side={side}
    className={cn('flex gap-2', className)}
    {...props}
  />
)

export {
  SeeYouThereCard,
  SeeYouThereCardBadges,
  SeeYouThereCardBody,
  SeeYouThereCardFooter,
  SeeYouThereCardHeader,
  SeeYouThereCardImage,
  SeeYouThereCardMeta,
  SeeYouThereCardOverlay,
  SeeYouThereCardTitle,
}

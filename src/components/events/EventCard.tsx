import { CalendarDays, MapPin, Users } from 'lucide-react'
import * as React from 'react'

import { LogoMark } from '@/components/Logo/LogoMark'
import {
  SeeYouThereCard,
  SeeYouThereCardBadges,
  SeeYouThereCardBody,
  SeeYouThereCardFooter,
  SeeYouThereCardHeader,
  SeeYouThereCardImage,
  SeeYouThereCardMeta,
  SeeYouThereCardOverlay,
  SeeYouThereCardTitle,
} from '@/components/SeeYouThereCard'
import { Badge } from '@/components/ui/badge'
import type { Category, Event, Location, Media } from '@/payload-types'
import { categoryColorClass } from '@/utilities/categoryColor'
import { formatDate, formatTime, todayIsoStart } from '@/utilities/formatDateTime'
import { populated, populatedList } from '@/utilities/payloadRelations'

type EventCardProps = {
  event: Event
  action?: React.ReactNode
  hideLocation?: boolean
  fallbackImage?: Media | null
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  action,
  hideLocation = false,
  fallbackImage,
}) => {
  const location = populated<Location>(event.location)
  const categories = populatedList<Category>(event.categories)
  const image =
    populated<Media>(event.image) ?? populated<Media>(location?.image) ?? fallbackImage
  const isCommunity = !event.createdBySeeYouThere
  const isPast = !!event.endDate && event.endDate < todayIsoStart()

  return (
    <SeeYouThereCard href={`/events/${event.slug}`}>
      {image?.url && <SeeYouThereCardImage src={image.url} alt={image.alt ?? event.title} />}
      <SeeYouThereCardOverlay intensity="soft" />
      {isPast && (
        <div
          aria-label="Afviklet"
          className="absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 -rotate-3 bg-brand-teal py-2 text-center text-sm font-bold uppercase tracking-[0.2em] text-foreground shadow-md"
        >
          Afviklet
        </div>
      )}
      <SeeYouThereCardHeader>
        <SeeYouThereCardBadges className="flex-wrap">
          {categories.map((c) => (
            <Badge key={c.id} color={categoryColorClass(c.color)}>
              {c.title}
            </Badge>
          ))}
        </SeeYouThereCardBadges>
        {action && <div className="shrink-0">{action}</div>}
      </SeeYouThereCardHeader>
      <SeeYouThereCardFooter>
        <SeeYouThereCardBody>
          <SeeYouThereCardTitle>{event.title}</SeeYouThereCardTitle>
          {location && !hideLocation && (
            <SeeYouThereCardMeta>
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{location.title}</span>
            </SeeYouThereCardMeta>
          )}
          <SeeYouThereCardMeta>
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              {formatDate(event.startDate)} • {formatTime(event.startTime)}
            </span>
          </SeeYouThereCardMeta>
        </SeeYouThereCardBody>
        {isCommunity ? (
          <Badge color="bg-brand-mint text-cream" className="shrink-0 gap-1">
            <Users className="h-3 w-3" aria-hidden />
            Fællesskab
          </Badge>
        ) : (
          <Badge color="bg-brand-teal text-cream" className="shrink-0 gap-1">
            <LogoMark className="h-3 w-3" />
            See You There
          </Badge>
        )}
      </SeeYouThereCardFooter>
    </SeeYouThereCard>
  )
}

import { CalendarDays, MapPin } from 'lucide-react'
import * as React from 'react'

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
import { formatDate, formatTime } from '@/utilities/formatDateTime'
import { populated, populatedList } from '@/utilities/payloadRelations'

type EventCardProps = {
  event: Event
  action?: React.ReactNode
}

export const EventCard: React.FC<EventCardProps> = ({ event, action }) => {
  const location = populated<Location>(event.location)
  const categories = populatedList<Category>(event.categories)
  const image = populated<Media>(event.image) ?? populated<Media>(location?.image)

  return (
    <SeeYouThereCard href={`/events/${event.slug}`}>
      {image?.url && <SeeYouThereCardImage src={image.url} alt={image.alt ?? event.title} />}
      <SeeYouThereCardOverlay intensity="soft" />
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
          {location && (
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
      </SeeYouThereCardFooter>
    </SeeYouThereCard>
  )
}

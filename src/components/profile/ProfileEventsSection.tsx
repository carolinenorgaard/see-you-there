import * as React from 'react'

import { EventCard } from '@/components/events/EventCard'
import { SeeYouThereGrid } from '@/components/SeeYouThereGrid'
import { Card, CardContent } from '@/components/ui/card'
import type { Event } from '@/payload-types'

export type ProfileEventsSectionProps = {
  title: string
  emptyMessage: string
  events: Event[]
  renderAction?: (event: Event) => React.ReactNode
}

export const ProfileEventsSection: React.FC<ProfileEventsSectionProps> = ({
  title,
  emptyMessage,
  events,
  renderAction,
}) => {
  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {events.length > 0 && (
          <span className="text-sm text-muted-foreground">{events.length}</span>
        )}
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            {emptyMessage}
          </CardContent>
        </Card>
      ) : (
        <SeeYouThereGrid>
          {events.map((event) => (
            <li key={event.id} className="contents">
              <EventCard event={event} action={renderAction?.(event)} />
            </li>
          ))}
        </SeeYouThereGrid>
      )}
    </section>
  )
}

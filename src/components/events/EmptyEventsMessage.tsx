import { noMatchingEventsIntro } from '@/app/(frontend)/events/content'
import {
  type EventsFilters,
  hasActiveFilters,
} from '@/components/events/filters/eventsFilters'
import RichText from '@/components/RichText'

export const EmptyEventsMessage = ({
  filters,
  variant = 'upcoming',
}: {
  filters: EventsFilters
  variant?: 'upcoming' | 'archive'
}) => {
  if (hasActiveFilters(filters)) {
    return <RichText data={noMatchingEventsIntro} enableGutter={false} className="max-w-3xl" />
  }

  const isSyt = filters.source === 'syt'
  const message =
    variant === 'archive'
      ? isSyt
        ? 'Ingen tidligere See You There begivenheder.'
        : 'Ingen tidligere fællesskabsbegivenheder.'
      : isSyt
        ? 'Ingen kommende See You There begivenheder endnu.'
        : 'Ingen kommende fællesskabsbegivenheder endnu.'

  return <p className="text-muted-foreground">{message}</p>
}

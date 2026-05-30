import { noMatchingEventsIntro } from '@/app/(frontend)/events/content'
import {
  type EventsFilters,
  hasActiveFilters,
} from '@/components/events/filters/eventsFilters'
import RichText from '@/components/RichText'

export const EmptyEventsMessage = ({ filters }: { filters: EventsFilters }) => {
  if (hasActiveFilters(filters)) {
    return <RichText data={noMatchingEventsIntro} enableGutter={false} className="max-w-3xl" />
  }

  const message =
    filters.source === 'syt'
      ? 'Ingen See You There begivenheder endnu.'
      : 'Ingen fællesskabsbegivenheder endnu.'

  return <p className="text-muted-foreground">{message}</p>
}

import { noMatchingEventsIntro } from '@/app/(frontend)/events/content'
import {
  hasActiveFilters,
  type ParsedEventFilters,
} from '@/components/events/filters/eventsFilters'
import RichText from '@/components/RichText'

export const EmptyEventsMessage = ({ filters }: { filters: ParsedEventFilters }) => {
  if (hasActiveFilters(filters)) {
    return <RichText data={noMatchingEventsIntro} enableGutter={false} className="max-w-3xl" />
  }

  const message =
    filters.source === 'syt'
      ? 'Ingen See You There begivenheder endnu.'
      : 'Ingen community begivenheder endnu.'

  return <p className="text-neutral-600">{message}</p>
}

import { noMatchingEventsIntro } from '@/app/(frontend)/events/content'
import {
  type EventsFilterState,
  hasActiveFilters,
} from '@/components/events/filters/eventsFilters'
import RichText from '@/components/RichText'

export const EmptyEventsMessage = ({ state }: { state: EventsFilterState }) => {
  if (hasActiveFilters(state)) {
    return <RichText data={noMatchingEventsIntro} enableGutter={false} className="max-w-3xl" />
  }

  const message =
    state.source === 'syt'
      ? 'Ingen See You There begivenheder endnu.'
      : 'Ingen community begivenheder endnu.'

  return <p className="text-muted-foreground">{message}</p>
}

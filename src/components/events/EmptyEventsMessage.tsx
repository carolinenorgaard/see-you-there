import {
  hasActiveFilters,
  type ParsedEventFilters,
} from '@/components/events/filters/eventsFilters'

const messageFor = (filters: ParsedEventFilters) => {
  if (hasActiveFilters(filters)) return 'Ingen begivenheder matcher de valgte filtre.'
  return filters.source === 'syt'
    ? 'Ingen See You There begivenheder endnu.'
    : 'Ingen community begivenheder endnu.'
}

export const EmptyEventsMessage = ({ filters }: { filters: ParsedEventFilters }) => (
  <p className="text-neutral-600">{messageFor(filters)}</p>
)

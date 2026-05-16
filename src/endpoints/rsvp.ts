import { buildToggleEndpoints } from './toggleRelationship'

export const rsvpEndpoints = buildToggleEndpoints({
  basePath: '/:id/rsvp',
  collection: 'events',
  field: 'attendees',
  responseKey: 'attending',
})

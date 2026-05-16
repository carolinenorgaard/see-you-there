import { buildToggleEndpoints } from './toggleRelationship'

export const likeEndpoints = buildToggleEndpoints({
  basePath: '/:id/like',
  collection: 'events',
  field: 'likes',
  responseKey: 'liked',
})

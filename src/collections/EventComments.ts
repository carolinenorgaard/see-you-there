import type { CollectionConfig } from 'payload'

import { adminOrAuthor } from '../access/adminOrAuthor'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const EventComments: CollectionConfig = {
  slug: 'event-comments',
  access: {
    create: authenticated,
    delete: adminOrAuthor,
    read: anyone,
    update: adminOrAuthor,
  },
  admin: {
    defaultColumns: ['event', 'author', 'createdAt'],
    useAsTitle: 'content',
  },
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      index: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: {
        update: () => false,
      },
      hooks: {
        beforeChange: [
          ({ req, operation, value }) => {
            if (operation === 'create' && req.user) return req.user.id
            return value
          },
        ],
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 2000,
    },
  ],
  timestamps: true,
}

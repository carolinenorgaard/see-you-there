import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { revalidateLocation, revalidateLocationDelete } from './hooks/revalidateLocation'

export const Locations: CollectionConfig = {
  slug: 'locations',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [revalidateLocation],
    afterDelete: [revalidateLocationDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'postalCode',
              type: 'text',
              admin: { width: '30%' },
            },
            {
              name: 'city',
              type: 'text',
              required: true,
              index: true,
              admin: { width: '70%' },
            },
          ],
        },
        {
          name: 'region',
          type: 'relationship',
          relationTo: 'regions',
          required: true,
          index: true,
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
      index: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'events',
      type: 'join',
      collection: 'events',
      on: 'location',
      admin: {
        description: 'Events held at this location (read-only).',
      },
    },
    slugField(),
  ],
}

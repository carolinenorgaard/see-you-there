import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

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
      name: 'description',
      type: 'textarea',
    },
    slugField(),
  ],
}

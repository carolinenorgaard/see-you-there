import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
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
      name: 'color',
      type: 'select',
      required: true,
      defaultValue: 'teal',
      admin: {
        description: 'Badge color used when this category appears on a card.',
      },
      options: [
        { label: 'Teal', value: 'teal' },
        { label: 'Pink', value: 'pink' },
        { label: 'Purple', value: 'purple' },
        { label: 'Orange', value: 'orange' },
        { label: 'Blue', value: 'blue' },
        { label: 'Amber', value: 'amber' },
      ],
    },
    slugField({
      position: undefined,
    }),
  ],
}

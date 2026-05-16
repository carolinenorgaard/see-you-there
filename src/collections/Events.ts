import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Events: CollectionConfig = {
  slug: 'events',
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
      name: 'createdBySeeYouThere',
      type: 'checkbox',
      label: 'Created by See You There',
      defaultValue: false,
      index: true,
      admin: {
        description:
          'Mark this event as an official See You There event. Uncheck for user-submitted events (future).',
      },
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
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'yyyy-MM-dd',
            },
            width: '50%',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'yyyy-MM-dd',
            },
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'HH:mm',
              timeFormat: 'HH:mm',
            },
            width: '50%',
          },
        },
        {
          name: 'endTime',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'HH:mm',
              timeFormat: 'HH:mm',
            },
            width: '50%',
          },
        },
      ],
    },
    slugField(),
  ],
}

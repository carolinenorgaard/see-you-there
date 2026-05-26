import type { CollectionConfig } from 'payload'
import { slugField, ValidationError } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { likeEndpoints } from '../endpoints/like'
import { rsvpEndpoints } from '../endpoints/rsvp'
import { revalidateEvent, revalidateEventDelete } from './hooks/revalidateEvent'

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
  endpoints: [...rsvpEndpoints, ...likeEndpoints],
  hooks: {
    afterChange: [revalidateEvent],
    afterDelete: [revalidateEventDelete],
    beforeValidate: [
      ({ data, req }) => {
        if (!data) return data
        if (!data.startDate || !data.endDate) return data

        const start = new Date(data.startDate)
        const end = new Date(data.endDate)
        const errors: { message: string; path: string }[] = []

        if (end < start) {
          errors.push({ path: 'endDate', message: 'End date must be on or after start date.' })
        } else {
          const sameDay =
            start.getUTCFullYear() === end.getUTCFullYear() &&
            start.getUTCMonth() === end.getUTCMonth() &&
            start.getUTCDate() === end.getUTCDate()

          if (
            sameDay &&
            data.startTime &&
            data.endTime &&
            new Date(data.endTime) < new Date(data.startTime)
          ) {
            errors.push({
              path: 'endTime',
              message: 'End time must be on or after start time when the event ends on the same day.',
            })
          }
        }

        if (errors.length > 0) {
          throw new ValidationError({ collection: 'events', errors, req })
        }

        return data
      },
    ],
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation !== 'create') return data
        if (req.user?.role !== 'admin') {
          data.createdBySeeYouThere = false
          if (req.user) data.createdBy = req.user.id
        }
        if (req.user) {
          const existing = Array.isArray(data.attendees) ? data.attendees : []
          if (!existing.includes(req.user.id)) {
            data.attendees = [...existing, req.user.id]
          }
        }
        return data
      },
    ],
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
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
    {
      name: 'attendees',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      index: true,
      admin: {
        description: 'Users who have RSVPed to this event. Managed via the /rsvp endpoint.',
      },
    },
    {
      name: 'likes',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      index: true,
      admin: {
        description: 'Users who liked this event. Managed via the /like endpoint.',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      admin: {
        description: 'User who submitted this event (auto-set for community submissions).',
        readOnly: true,
      },
    },
    slugField(),
  ],
}

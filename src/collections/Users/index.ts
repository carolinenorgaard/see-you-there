import type { CollectionConfig } from 'payload'

import { admin } from '../../access/admin'
import { adminOrSelf } from '../../access/adminOrSelf'
import { anyone } from '../../access/anyone'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: admin,
    create: anyone,
    delete: admin,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: {
    verify: true,
    forgotPassword: {
      generateEmailSubject: () => 'Reset your See You There password',
      generateEmailHTML: ({ token } = {}) => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/reset-password?token=${token}`
        return `<p>Click <a href="${url}">here</a> to reset your password.</p>`
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'age',
          type: 'number',
          min: 0,
          max: 130,
          admin: { width: '33%' },
        },
        {
          name: 'zipCode',
          type: 'text',
          label: 'Zip code',
          admin: { width: '33%' },
        },
        {
          name: 'city',
          type: 'text',
          admin: { width: '34%' },
        },
      ],
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'attendingEvents',
      type: 'join',
      collection: 'events',
      on: 'attendees',
      admin: {
        description: 'Events this user has RSVPed to (read-only).',
      },
    },
    {
      name: 'likedEvents',
      type: 'join',
      collection: 'events',
      on: 'likes',
      admin: {
        description: 'Events this user has liked (read-only).',
      },
    },
  ],
  timestamps: true,
}

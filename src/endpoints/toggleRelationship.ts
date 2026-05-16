import type { Endpoint, PayloadRequest } from 'payload'

import { extractIds } from '@/utilities/extractIds'

type ToggleConfig = {
  basePath: string
  collection: 'events'
  field: 'attendees' | 'likes'
  responseKey: string
}

const getId = (req: PayloadRequest): string | null =>
  (req.routeParams as { id?: string } | undefined)?.id ?? null

export const buildToggleEndpoints = ({
  basePath,
  collection,
  field,
  responseKey,
}: ToggleConfig): Endpoint[] => [
  {
    path: basePath,
    method: 'post',
    handler: async (req) => {
      if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
      const id = getId(req)
      if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

      const doc = await req.payload.findByID({ collection, id, depth: 0 })
      const current = extractIds((doc as unknown as Record<string, unknown>)[field])
      const userId = req.user.id
      if (!current.includes(userId)) {
        await req.payload.update({
          collection,
          id,
          data: { [field]: [...current, userId] } as never,
          overrideAccess: true,
        })
      }
      return Response.json({ ok: true, [responseKey]: true })
    },
  },
  {
    path: basePath,
    method: 'delete',
    handler: async (req) => {
      if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
      const id = getId(req)
      if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

      const doc = await req.payload.findByID({ collection, id, depth: 0 })
      const current = extractIds((doc as unknown as Record<string, unknown>)[field])
      const userId = req.user.id
      const next = current.filter((v) => v !== userId)
      if (next.length !== current.length) {
        await req.payload.update({
          collection,
          id,
          data: { [field]: next } as never,
          overrideAccess: true,
        })
      }
      return Response.json({ ok: true, [responseKey]: false })
    },
  },
]

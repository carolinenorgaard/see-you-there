import { cookies } from 'next/headers'

import type { User } from '@/payload-types'
import { getClientSideURL } from './getURL'

export const getOptionalMe = async (): Promise<User | null> => {
  const token = (await cookies()).get('payload-token')?.value
  if (!token) return null

  const res = await fetch(`${getClientSideURL()}/api/users/me`, {
    headers: { Authorization: `JWT ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return null

  const body = (await res.json()) as { user: User | null }
  return body.user
}

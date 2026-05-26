import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

import type { User } from '@/payload-types'

export const getOptionalMe = async (): Promise<User | null> => {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })
  return (user as User) ?? null
}

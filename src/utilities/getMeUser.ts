import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import type { User } from '../payload-types'

export const getMeUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  user: User
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })

  if (validUserRedirect && user) {
    redirect(validUserRedirect)
  }

  if (!user) {
    if (nullUserRedirect) redirect(nullUserRedirect)
    throw new Error('getMeUser: no user and no nullUserRedirect provided')
  }

  return { user }
}

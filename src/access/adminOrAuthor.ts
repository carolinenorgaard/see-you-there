import type { Access } from 'payload'

export const adminOrAuthor: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return { author: { equals: user.id } }
}

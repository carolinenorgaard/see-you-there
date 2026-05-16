import type { EmailAdapter } from 'payload'

export const consoleEmailAdapter: EmailAdapter = () => ({
  name: 'console',
  defaultFromAddress: 'dev@localhost',
  defaultFromName: 'See You There (dev)',
  sendEmail: async (message) => {
    const to = Array.isArray(message.to) ? message.to.join(', ') : message.to
    console.log('\n========== EMAIL ==========')
    console.log('To:     ', to)
    console.log('Subject:', message.subject)
    console.log('---')
    console.log(message.html || message.text || '(no body)')
    console.log('===========================\n')
    return { messageId: `console-${Date.now()}` }
  },
})

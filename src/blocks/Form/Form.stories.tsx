import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FormBlock } from './Component'
import { mockRichText } from '../../../.storybook/fixtures'

const meta: Meta<typeof FormBlock> = {
  title: 'Blocks/Form',
  component: FormBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Submission posts to /api/form-submissions on the live Payload server — submitting from Storybook will fail without a backend.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FormBlock>

const mockForm = {
  id: 'mock-form',
  title: 'Contact form',
  submitButtonLabel: 'Send',
  confirmationType: 'message',
  confirmationMessage: mockRichText,
  fields: [
    { blockType: 'text', name: 'fullName', label: 'Full name', required: true, width: 100 },
    { blockType: 'email', name: 'email', label: 'Email', required: true, width: 100 },
    { blockType: 'textarea', name: 'message', label: 'Message', width: 100 },
    { blockType: 'checkbox', name: 'subscribe', label: 'Subscribe to updates' },
  ],
} as any

export const Default: Story = {
  args: {
    enableIntro: false,
    form: mockForm,
  },
}

export const WithIntro: Story = {
  args: {
    enableIntro: true,
    introContent: mockRichText,
    form: mockForm,
  },
}

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AdminBar } from './index'

const meta: Meta<typeof AdminBar> = {
  title: 'Components/AdminBar',
  component: AdminBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AdminBar only renders when the visitor is authenticated against the Payload CMS API. In Storybook there is no live API, so the bar is hidden by default. The story below visualises the wrapper element.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof AdminBar>

export const Default: Story = {}

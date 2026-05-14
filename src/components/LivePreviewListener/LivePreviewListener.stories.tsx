import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LivePreviewListener } from './index'

const meta: Meta<typeof LivePreviewListener> = {
  title: 'Components/LivePreviewListener',
  component: LivePreviewListener,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Headless component that subscribes to Payload live-preview messages and refreshes the Next.js router. Renders nothing visible.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof LivePreviewListener>

export const Default: Story = {
  render: () => (
    <div className="text-sm text-muted-foreground">
      <LivePreviewListener />
      LivePreviewListener mounted (no visible UI).
    </div>
  ),
}

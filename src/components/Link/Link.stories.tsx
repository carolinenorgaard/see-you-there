import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CMSLink } from './index'

const meta: Meta<typeof CMSLink> = {
  title: 'Components/CMSLink',
  component: CMSLink,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    appearance: {
      control: 'select',
      options: ['inline', 'default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: { control: 'select', options: ['default', 'sm', 'lg', 'icon', 'clear'] },
  },
}

export default meta
type Story = StoryObj<typeof CMSLink>

export const Inline: Story = {
  args: { type: 'custom', url: '/about', label: 'About us', appearance: 'inline' },
}

export const ButtonDefault: Story = {
  args: { type: 'custom', url: '/about', label: 'Learn more', appearance: 'default' },
}

export const ButtonOutline: Story = {
  args: { type: 'custom', url: '/about', label: 'Learn more', appearance: 'outline' },
}

export const NewTab: Story = {
  args: {
    type: 'custom',
    url: 'https://payloadcms.com',
    label: 'External link',
    newTab: true,
    appearance: 'link',
  },
}

export const Reference: Story = {
  args: {
    type: 'reference',
    appearance: 'default',
    label: 'Go to page',
    reference: {
      relationTo: 'pages',
      value: { id: 1, slug: 'about', title: 'About' } as any,
    },
  },
}

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Link from 'next/link'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

/**
 * The real Footer component is an async server component that calls `getCachedGlobal('footer')`
 * to fetch nav data from Payload — that can't run in Storybook. This story renders the same
 * markup with mock nav items so the layout can be iterated on.
 */
const FooterPreview = ({
  navItems,
}: {
  navItems: { link: { type: 'custom'; url: string; label: string } }[]
}) => (
  <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
    <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
      <Link className="flex items-center" href="/">
        <Logo />
      </Link>
      <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
        <ThemeSelector />
        <nav className="flex flex-col md:flex-row gap-4">
          {navItems.map(({ link }, i) => (
            <CMSLink className="text-white" key={i} {...link} />
          ))}
        </nav>
      </div>
    </div>
  </footer>
)

const meta: Meta<typeof FooterPreview> = {
  title: 'Layout/Footer',
  component: FooterPreview,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof FooterPreview>

export const Default: Story = {
  args: {
    navItems: [
      { link: { type: 'custom', url: '/about', label: 'About' } },
      { link: { type: 'custom', url: '/posts', label: 'Posts' } },
      { link: { type: 'custom', url: '/contact', label: 'Contact' } },
    ],
  },
}

export const Empty: Story = {
  args: { navItems: [] },
}

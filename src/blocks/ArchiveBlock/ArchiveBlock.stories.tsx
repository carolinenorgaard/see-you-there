import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CollectionArchive } from '@/components/CollectionArchive'
import RichText from '@/components/RichText'
import { mockPosts, mockRichText } from '../../../.storybook/fixtures'

/**
 * The real ArchiveBlock is an async server component that calls `getPayload()` to query
 * the database — that can't run in Storybook. This story renders the same visual output
 * (intro RichText + CollectionArchive) using mock posts so you can iterate on the layout.
 */
const ArchiveBlockPreview = ({
  introContent,
  posts,
}: {
  introContent?: typeof mockRichText
  posts: typeof mockPosts
}) => (
  <div className="my-16">
    {introContent && (
      <div className="container mb-16">
        <RichText className="ms-0 max-w-3xl" data={introContent} enableGutter={false} />
      </div>
    )}
    <CollectionArchive posts={posts} />
  </div>
)

const meta: Meta<typeof ArchiveBlockPreview> = {
  title: 'Blocks/ArchiveBlock',
  component: ArchiveBlockPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ArchiveBlockPreview>

export const Default: Story = {
  args: { posts: mockPosts },
}

export const WithIntro: Story = {
  args: { posts: mockPosts, introContent: mockRichText },
}

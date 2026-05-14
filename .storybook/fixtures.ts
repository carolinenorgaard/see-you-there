import type { Media, Post, Page, Category } from '@/payload-types'

export const mockMedia: Media = {
  id: 1,
  alt: 'Sample image',
  url: 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200',
  filename: 'sample.jpg',
  mimeType: 'image/jpeg',
  filesize: 12345,
  width: 1200,
  height: 800,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
} as unknown as Media

export const mockCategory: Category = {
  id: 1,
  title: 'Technology',
  slug: 'technology',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
} as unknown as Category

export const mockPost: Post = {
  id: 1,
  title: 'Sample Post Title',
  slug: 'sample-post',
  categories: [mockCategory],
  meta: {
    title: 'Sample Post',
    description: 'A short description that summarises the post content for previews and cards.',
    image: mockMedia,
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  _status: 'published',
} as unknown as Post

export const mockPosts: Post[] = [
  mockPost,
  { ...mockPost, id: 2, title: 'Second Post', slug: 'second-post' } as unknown as Post,
  { ...mockPost, id: 3, title: 'Third Post', slug: 'third-post' } as unknown as Post,
]

export const mockPage: Page = {
  id: 1,
  title: 'About Us',
  slug: 'about',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  _status: 'published',
} as unknown as Page

export const mockRichText = {
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'heading',
        tag: 'h2',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            text: 'A heading inside rich text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      },
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            text: 'This is a paragraph rendered through the Lexical converters. It supports ',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
          {
            type: 'text',
            text: 'bold',
            detail: 0,
            format: 1,
            mode: 'normal',
            style: '',
            version: 1,
          },
          {
            type: 'text',
            text: ' and ',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
          {
            type: 'text',
            text: 'italic',
            detail: 0,
            format: 2,
            mode: 'normal',
            style: '',
            version: 1,
          },
          {
            type: 'text',
            text: ' text inline.',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      },
    ],
  },
} as any

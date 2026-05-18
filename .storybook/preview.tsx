import type { Preview } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import '../src/app/(frontend)/globals.css'

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'data-theme on <html>',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
      dynamicTitle: true,
    },
  },
}

export const initialGlobals = { theme: 'light' }

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story, ctx) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', ctx.globals.theme ?? 'light')
      }
      const nuqsParams = (ctx.parameters as { nuqs?: { searchParams?: string } }).nuqs
      return (
        <NuqsTestingAdapter
          searchParams={nuqsParams?.searchParams ?? ''}
          onUrlUpdate={(update) => action('nuqs:url-update')(update.queryString)}
        >
          <Story />
        </NuqsTestingAdapter>
      )
    },
  ],
}

export default preview

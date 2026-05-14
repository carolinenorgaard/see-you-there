import type { StorybookConfig } from '@storybook/nextjs-vite'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {}
    const existingAlias = config.resolve.alias
    const filteredAlias = Array.isArray(existingAlias)
      ? existingAlias.filter((a) => a.find !== 'react' && a.find !== 'react-dom')
      : Object.fromEntries(
          Object.entries(existingAlias ?? {}).filter(
            ([k]) => k !== 'react' && k !== 'react-dom',
          ),
        )
    config.resolve.alias = {
      ...(Array.isArray(filteredAlias) ? {} : filteredAlias),
      '@': path.resolve(dirname, '../src'),
      '@payload-config': path.resolve(dirname, '../src/payload.config.ts'),
      react: path.resolve(dirname, '../node_modules/react'),
      'react-dom': path.resolve(dirname, '../node_modules/react-dom'),
    }
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    return config
  },
}

export default config

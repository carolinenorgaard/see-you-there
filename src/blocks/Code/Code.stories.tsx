import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CodeBlock } from './Component'

const meta: Meta<typeof CodeBlock> = {
  title: 'Blocks/Code',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: {
    language: { control: 'select', options: ['typescript', 'javascript', 'jsx', 'tsx', 'css'] },
  },
}

export default meta
type Story = StoryObj<typeof CodeBlock>

export const TypeScript: Story = {
  args: {
    blockType: 'code',
    language: 'typescript',
    code: `export function greet(name: string): string {\n  return \`Hello, \${name}!\`\n}\n\nconsole.log(greet('world'))`,
  },
}

export const Css: Story = {
  args: {
    blockType: 'code',
    language: 'css',
    code: `.button {\n  background: hsl(var(--primary));\n  color: white;\n  padding: 0.5rem 1rem;\n}`,
  },
}

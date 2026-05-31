import type { Meta, StoryObj } from '@storybook/react'

import { ProgressLine } from './ProgressLine'

const meta: Meta<typeof ProgressLine> = {
  title: 'Components/ProgressLine',
  component: ProgressLine,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
}

export default meta
type Story = StoryObj<typeof ProgressLine>

export const Default: Story = {
  args: { value: 60 },
}

export const Tamanhos: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <ProgressLine value={30} size="sm" />
      <ProgressLine value={60} size="md" />
      <ProgressLine value={80} size="lg" />
    </div>
  ),
}

export const Indeterminado: Story = {
  args: { value: null, size: 'md' },
}

export const Completo: Story = {
  args: { value: 100, size: 'md' },
}

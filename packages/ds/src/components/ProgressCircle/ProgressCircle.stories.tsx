import type { Meta, StoryObj } from '@storybook/react'

import { ProgressCircle } from './ProgressCircle'

const meta: Meta<typeof ProgressCircle> = {
  title: 'Components/ProgressCircle',
  component: ProgressCircle,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
}

export default meta
type Story = StoryObj<typeof ProgressCircle>

export const Default: Story = {
  args: { value: 65 },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressCircle value={40} size="sm" />
      <ProgressCircle value={65} size="md" />
      <ProgressCircle value={85} size="lg" />
    </div>
  ),
}

export const Indeterminate: Story = {
  args: { value: null, size: 'md' },
}

export const Complete: Story = {
  args: { value: 100, size: 'md' },
}

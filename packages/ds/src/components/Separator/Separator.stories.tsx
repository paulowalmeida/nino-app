import type { Meta, StoryObj } from '@storybook/react'

import { Separator } from './Separator'

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
}

export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <p className="text-sm text-gray-600">Section A</p>
      <Separator {...args} className="my-3" />
      <p className="text-sm text-gray-600">Section B</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-8">
      <span className="text-sm text-gray-600">Item A</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-gray-600">Item B</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-gray-600">Item C</span>
    </div>
  ),
}

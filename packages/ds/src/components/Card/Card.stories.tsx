import type { Meta, StoryObj } from '@storybook/react'

import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'flat', 'elevated'] },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: { children: 'Card content', className: 'w-64' },
}

export const Flat: Story = {
  args: { variant: 'flat', children: 'Flat card', className: 'w-64' },
}

export const Elevated: Story = {
  args: { variant: 'elevated', children: 'Elevated card', className: 'w-64' },
}

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card className="w-48">default</Card>
      <Card variant="flat" className="w-48">
        flat
      </Card>
      <Card variant="elevated" className="w-48">
        elevated
      </Card>
    </div>
  ),
}

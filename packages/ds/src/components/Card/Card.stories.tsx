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

/**
 * When the surface itself is the click target, `asChild` hands the styling to
 * the child — the link or button keeps its own semantics and focus ring, with
 * no wrapper in between.
 */
export const AsChild: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card asChild className="w-48 transition-shadow hover:shadow-card-hover">
        <a href="#pedidos">
          <span className="text-2xl font-bold text-ink">12</span>
          <span className="mt-1 block text-sm text-subtle">na fila</span>
        </a>
      </Card>

      <Card asChild variant="flat" className="w-48 text-left">
        <button type="button">
          <span className="text-sm font-semibold text-ink">
            Lanchonete do Zé
          </span>
          <span className="mt-1 block text-xs text-faint">Centro</span>
        </button>
      </Card>
    </div>
  ),
}

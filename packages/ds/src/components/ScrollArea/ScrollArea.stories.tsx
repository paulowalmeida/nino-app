import type { Meta, StoryObj } from '@storybook/react'

import { ScrollArea } from './ScrollArea'

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ScrollArea>

/*
 * Sizing goes through `style`, not utility classes: the DS Tailwind build
 * excludes `*.stories.tsx` from its `@source`, so a class used only here is
 * never generated and the box would render unconstrained.
 */
export const Default: Story = {
  render: () => (
    <ScrollArea
      className="rounded-card border border-line"
      style={{ height: 192, width: 256 }}
    >
      <div className="p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="py-1 text-sm text-body">
            Pedido #{1000 + i}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
}

/** Horizontal overflow: the bottom bar shows up on the same rules. */
export const Horizontal: Story = {
  render: () => (
    <ScrollArea
      className="rounded-card border border-line"
      style={{ width: 280 }}
    >
      <div className="flex gap-2 p-3" style={{ width: 620 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="rounded-card bg-surface-mute px-3 py-6 text-sm text-body"
            style={{ minWidth: 120 }}
          >
            Mesa {i + 1}
          </span>
        ))}
      </div>
    </ScrollArea>
  ),
}

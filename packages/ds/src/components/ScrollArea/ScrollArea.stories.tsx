import type { Meta, StoryObj } from '@storybook/react'

import { ScrollArea } from './ScrollArea'

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof ScrollArea>

/*
 * Sizing goes through `style`, not utility classes: the DS Tailwind build
 * excludes `*.stories.tsx` from its `@source`, so a class used only here is
 * never generated and the box would render unconstrained.
 */
export const Default: Story = {
  render: (args) => (
    <ScrollArea
      {...args}
      className="rounded-2 border border-border"
      style={{ height: 192, width: 256 }}
    >
      <div className="p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="py-1 text-sm text-fg-default">
            Pedido #{1000 + i}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
}

/**
 * Opt-in edge fade: the content dissolves against any edge it can still
 * scroll past, and goes solid once that end is reached.
 */
export const WithFadeEdges: Story = {
  render: () => (
    <ScrollArea
      fadeEdges
      className="rounded-2 border border-border"
      style={{ height: 192, width: 256 }}
    >
      <div className="p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="py-1 text-sm text-fg-default">
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
      className="rounded-2 border border-border"
      style={{ width: 280 }}
    >
      <div className="flex gap-2 p-3" style={{ width: 620 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="rounded-2 bg-surface-mute px-3 py-6 text-sm text-fg-default"
            style={{ minWidth: 120 }}
          >
            Mesa {i + 1}
          </span>
        ))}
      </div>
    </ScrollArea>
  ),
}

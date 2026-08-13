import type { Meta, StoryObj } from '@storybook/react'

import { HoverCard } from './HoverCard'

const meta: Meta<typeof HoverCard> = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
    trigger: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof HoverCard>

export const Default: Story = {
  render: (args) => (
    <div className="p-16">
      <HoverCard
        {...args}
        trigger={
          <a href="#" className="font-medium text-brand underline">
            Burgão do Zé
          </a>
        }
      >
        <p className="font-semibold text-gray-900">Burgão do Zé</p>
        <p>★ 4.8 · 25–40 min · Frete R$ 3,99</p>
      </HoverCard>
    </div>
  ),
}

import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { CountUp } from './CountUp'

const VALUES = [0, 42, 1280, 7]

function InteractiveDemo() {
  const [index, setIndex] = useState(0)

  return (
    <button
      type="button"
      className="text-3xl font-bold"
      onClick={() => setIndex((current) => (current + 1) % VALUES.length)}
    >
      <CountUp value={VALUES[index]} />
    </button>
  )
}

const meta: Meta<typeof CountUp> = {
  title: 'Components/CountUp',
  component: CountUp,
  tags: ['autodocs'],
  args: { value: 128 },
  argTypes: {
    value: {
      control: 'number',
      description: 'Target value — animates from the previous render value',
    },
  },
}

export default meta
type Story = StoryObj<typeof CountUp>

export const Default: Story = {
  render: (args) => (
    <span className="text-3xl font-bold">
      <CountUp {...args} />
    </span>
  ),
}

/** Click to jump between values and watch it animate. */
export const Interactive: Story = {
  render: () => <InteractiveDemo />,
}

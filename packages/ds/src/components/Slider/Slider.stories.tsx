import type { Meta, StoryObj } from '@storybook/react'

import { Slider } from './Slider'

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  args: { defaultValue: 40 },
}

export const WithLabelAndValue: Story = {
  args: { label: 'Max price', showValue: true, defaultValue: 60 },
}

export const WithStep: Story = {
  args: {
    label: 'Rating',
    defaultValue: 3,
    min: 0,
    max: 5,
    step: 1,
    showValue: true,
  },
}

export const Disabled: Story = {
  args: { defaultValue: 50, disabled: true },
}

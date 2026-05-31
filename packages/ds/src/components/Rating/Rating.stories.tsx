import type { Meta, StoryObj } from '@storybook/react'

import { Rating } from './Rating'

const meta: Meta<typeof Rating> = {
  title: 'Components/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    count: { control: { type: 'number', min: 1, max: 10 } },
    defaultValue: { control: { type: 'number', min: 0 } },
  },
}

export default meta
type Story = StoryObj<typeof Rating>

export const Default: Story = {
  args: { defaultValue: 0 },
}

export const WithValue: Story = {
  args: { defaultValue: 3 },
}

export const ReadOnly: Story = {
  args: { value: 4, readOnly: true },
}

export const AllowHalf: Story = {
  args: { defaultValue: 2.5, allowHalf: true },
}

export const Disabled: Story = {
  args: { defaultValue: 3, disabled: true },
}

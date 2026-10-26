import type { Meta, StoryObj } from '@storybook/react'

import { TimePicker } from './TimePicker'

const meta: Meta<typeof TimePicker> = {
  title: 'Components/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    step: { control: 'number' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof TimePicker>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: '08:00' },
}

export const HalfHourStep: Story = {
  args: { step: 30 },
}

export const Error: Story = {
  args: { error: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-40">
      <TimePicker size="sm" placeholder="Small" />
      <TimePicker size="md" placeholder="Medium" />
      <TimePicker size="lg" placeholder="Large" />
    </div>
  ),
}

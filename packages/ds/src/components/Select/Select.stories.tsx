import type { Meta, StoryObj } from '@storybook/react'

import { Select } from './Select'

const options = [
  { value: 'consumer', label: 'Consumer app' },
  { value: 'manager', label: 'Manager app' },
  { value: 'courier', label: 'Courier app' },
  { value: 'backoffice', label: 'Backoffice', disabled: true },
]

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { options, placeholder: 'Select an app...' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: 'manager' },
}

export const Error: Story = {
  args: { error: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      <Select options={options} size="sm" placeholder="Small" />
      <Select options={options} size="md" placeholder="Medium" />
      <Select options={options} size="lg" placeholder="Large" />
    </div>
  ),
}

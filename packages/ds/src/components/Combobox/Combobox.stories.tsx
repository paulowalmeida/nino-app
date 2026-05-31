import type { Meta, StoryObj } from '@storybook/react'

import { Combobox } from './Combobox'

const options = [
  { value: 'consumer', label: 'Consumer app' },
  { value: 'manager', label: 'Manager app' },
  { value: 'courier', label: 'Courier app' },
  { value: 'backoffice', label: 'Backoffice', disabled: true },
]

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: { options, placeholder: 'Buscar app...' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Combobox>

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
      <Combobox options={options} size="sm" placeholder="Small" />
      <Combobox options={options} size="md" placeholder="Medium" />
      <Combobox options={options} size="lg" placeholder="Large" />
    </div>
  ),
}

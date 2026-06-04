import type { Meta, StoryObj } from '@storybook/react'

import { FormField } from '../FormField'
import { NumberInput } from './NumberInput'

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-48">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof NumberInput>

export const Default: Story = {
  args: { defaultValue: 1, min: 0, max: 99 },
}

export const Quantity: Story = {
  args: { defaultValue: 1, min: 1, max: 10, step: 1 },
}

export const Price: Story = {
  args: { defaultValue: 29.9, min: 0, step: 0.1 },
}

export const WithError: Story = {
  args: { defaultValue: -1, error: true },
}

export const Disabled: Story = {
  args: { defaultValue: 5, disabled: true },
}

export const WithFormField: Story = {
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
  args: { name: 'quantity', defaultValue: 1, min: 1, max: 99 },
  render: (args) => (
    <FormField label="Quantity" helperText="Between 1 and 99">
      <NumberInput {...args} />
    </FormField>
  ),
}

export const WithFormFieldError: Story = {
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
  args: { name: 'quantity', defaultValue: 0, min: 1, max: 99, error: true },
  render: (args) => (
    <FormField label="Quantity" error="Must be at least 1">
      <NumberInput {...args} />
    </FormField>
  ),
}

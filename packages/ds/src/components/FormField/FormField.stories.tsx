import type { Meta, StoryObj } from '@storybook/react'

import { Box } from '../Box/Box'
import { Input } from '../Input/Input'
import { FormField } from './FormField'

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
    label: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof FormField>

export const Default: Story = {
  args: {
    label: 'Email',
    helperText: 'Use your work email',
  },
  render: (args) => (
    <FormField {...args}>
      <Input placeholder="name@company.com" />
    </FormField>
  ),
}

export const Required: Story = {
  args: {
    label: 'Full name',
    required: true,
  },
  render: (args) => (
    <FormField {...args}>
      <Input placeholder="John Smith" />
    </FormField>
  ),
}

export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Invalid email',
    required: true,
  },
  render: (args) => (
    <FormField {...args}>
      <Input
        placeholder="name@company.com"
        error
        defaultValue="invalid-email"
      />
    </FormField>
  ),
}

export const WithoutLabel: Story = {
  args: {
    helperText: 'Field only, no label',
  },
  render: (args) => (
    <FormField {...args}>
      <Input placeholder="No label" />
    </FormField>
  ),
}

export const LabelVariants: Story = {
  render: () => (
    <Box gap={6}>
      <FormField label="Nome completo" helperText="Como aparece no pedido">
        <Input placeholder="João da Silva" />
      </FormField>
      <FormField label="Nome completo" labelVariant="compact">
        <Input placeholder="João da Silva" />
      </FormField>
    </Box>
  ),
}

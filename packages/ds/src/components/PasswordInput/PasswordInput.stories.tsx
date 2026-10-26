import type { Meta, StoryObj } from '@storybook/react'

import { PasswordInput } from './PasswordInput'

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof PasswordInput>

export const Default: Story = {
  args: { placeholder: 'Sua senha' },
}

export const WithError: Story = {
  args: { placeholder: 'Sua senha', error: true, defaultValue: '123' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <PasswordInput size="sm" placeholder="sm" />
      <PasswordInput size="md" placeholder="md" />
      <PasswordInput size="lg" placeholder="lg" />
    </div>
  ),
}

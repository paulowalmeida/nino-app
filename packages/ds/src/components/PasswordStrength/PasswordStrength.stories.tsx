import type { Meta, StoryObj } from '@storybook/react'

import { PasswordStrength } from './PasswordStrength'

const meta: Meta<typeof PasswordStrength> = {
  title: 'Components/PasswordStrength',
  component: PasswordStrength,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PasswordStrength>

export const Weak: Story = {
  args: { password: 'abc' },
}

export const Medium: Story = {
  args: { password: 'abcdefgh' },
}

export const Strong: Story = {
  args: { password: 'Abcdefgh1!' },
}

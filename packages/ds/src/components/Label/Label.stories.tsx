import type { Meta, StoryObj } from '@storybook/react'

import { Input } from '../Input'
import { Label } from './Label'

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    required: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: { children: 'Email address', htmlFor: 'email' },
}

export const Required: Story = {
  args: { children: 'Full name', htmlFor: 'name', required: true },
}

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="email" required>Email address</Label>
      <Input id="email" placeholder="you@example.com" />
    </div>
  ),
}

export const WithInputError: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="email" required>Email address</Label>
      <Input id="email" defaultValue="not-an-email" error />
    </div>
  ),
}

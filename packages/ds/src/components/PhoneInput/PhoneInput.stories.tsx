import type { Meta, StoryObj } from '@storybook/react'

import { PhoneInput } from './PhoneInput'

const meta: Meta<typeof PhoneInput> = {
  title: 'Components/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PhoneInput>

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <PhoneInput {...args} />
    </div>
  ),
}

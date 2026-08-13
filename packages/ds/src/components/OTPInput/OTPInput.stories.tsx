import type { Meta, StoryObj } from '@storybook/react'

import { OTPInput } from './OTPInput'

const meta: Meta<typeof OTPInput> = {
  title: 'Components/OTPInput',
  component: OTPInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof OTPInput>

export const Default: Story = {
  args: { otp: true },
  render: (args) => <OTPInput {...args} />,
}

export const FourDigits: Story = {
  render: () => <OTPInput length={4} otp />,
}

export const Invalid: Story = {
  render: () => <OTPInput otp invalid />,
}

export const Disabled: Story = {
  render: () => <OTPInput disabled />,
}

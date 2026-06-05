import type { Meta, StoryObj } from '@storybook/react'

import { QRCode } from './QRCode'

const meta: Meta<typeof QRCode> = {
  title: 'Components/QRCode',
  component: QRCode,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof QRCode>

export const Default: Story = {
  args: { value: 'https://burgaodoze.nino.delivery' },
}

export const Small: Story = {
  args: { value: 'https://nino.delivery', size: 96 },
}

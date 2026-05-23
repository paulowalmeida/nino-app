import type { Meta, StoryObj } from '@storybook/react'

import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
    size: { control: 'number' },
  },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Visible: Story = {
  name: 'Visível',
  args: { visible: true, size: 16 },
}

export const Large: Story = {
  name: 'Grande',
  args: { visible: true, size: 32 },
}

export const Hidden: Story = {
  name: 'Oculto',
  args: { visible: false },
}

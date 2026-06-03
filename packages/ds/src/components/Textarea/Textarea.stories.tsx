import type { Meta, StoryObj } from '@storybook/react'

import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: 'Type your message...',
    rows: 4,
  },
}

export const WithError: Story = {
  args: {
    placeholder: 'Required field',
    error: true,
    rows: 4,
  },
}

export const Disabled: Story = {
  args: {
    value: 'Non-editable content',
    disabled: true,
    rows: 3,
  },
}

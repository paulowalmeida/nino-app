import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'
import { LoadingDots } from './LoadingDots'

const meta: Meta<typeof LoadingDots> = {
  title: 'Components/LoadingDots',
  component: LoadingDots,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof LoadingDots>

export const Default: Story = {
  args: { visible: true },
}

export const InButton: Story = {
  render: () => <Button loading loadingIndicator="dots" />,
}

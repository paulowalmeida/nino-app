import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'
import { Toast, ToastProvider, ToastViewport } from './Toast'

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="flex flex-col items-center gap-4 p-8">
          <Story />
          <ToastViewport className="relative bottom-auto right-auto" />
        </div>
      </ToastProvider>
    ),
  ],
  argTypes: {
    variant: { control: 'select', options: ['default', 'success', 'error', 'warning'] },
    duration: { control: 'number' },
  },
}

export default meta
type Story = StoryObj<typeof Toast>

export const Default: Story = {
  args: { title: 'Notification', defaultOpen: true, duration: Infinity },
}

export const WithDescription: Story = {
  args: {
    title: 'Order confirmed!',
    description: 'Your order #1234 is being prepared.',
    variant: 'success',
    defaultOpen: true,
    duration: Infinity,
  },
}

export const Error: Story = {
  args: {
    title: 'Something went wrong',
    description: 'Please try again.',
    variant: 'error',
    defaultOpen: true,
    duration: Infinity,
  },
}

export const Warning: Story = {
  args: {
    title: 'Session expiring',
    description: 'You will be logged out in 5 minutes.',
    variant: 'warning',
    defaultOpen: true,
    duration: Infinity,
  },
}

export const Triggered: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show notification</Button>
        <Toast
          title="Order confirmed!"
          description="Your order is being prepared."
          variant="success"
          open={open}
          onOpenChange={setOpen}
        />
      </>
    )
  },
}

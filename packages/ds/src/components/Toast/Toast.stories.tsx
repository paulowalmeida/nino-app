import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'
import { ToastContainer, toast } from './Toast'
import type { ToastVariant } from './Toast.types'

const meta: Meta<typeof ToastContainer> = {
  title: 'Components/Toast',
  component: ToastContainer,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='flex flex-col items-center gap-4 p-8'>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ToastContainer>

export const Default: Story = {
  render: () => (
    <Button onClick={() => toast.default('Notification')}>Show default</Button>
  ),
}

export const Success: Story = {
  render: () => (
    <Button onClick={() => toast.success('Order confirmed!', 'Your order #1234 is being prepared.')}>
      Show success
    </Button>
  ),
}

export const Error: Story = {
  render: () => (
    <Button variant='outline' onClick={() => toast.error('Something went wrong', 'Please try again.')}>
      Show error
    </Button>
  ),
}

export const Warning: Story = {
  render: () => (
    <Button variant='outline' onClick={() => toast.warning('Session expiring', 'You will be logged out in 5 minutes.')}>
      Show warning
    </Button>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      {(['default', 'success', 'error', 'warning'] as ToastVariant[]).map((v) => (
        <Button key={v} variant='outline' onClick={() => toast[v](v.charAt(0).toUpperCase() + v.slice(1))}>
          {v}
        </Button>
      ))}
    </div>
  ),
}

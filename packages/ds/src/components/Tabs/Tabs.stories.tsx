import type { Meta, StoryObj } from '@storybook/react'

import { Tabs } from './Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  args: {
    tabs: [
      { value: 'orders', label: 'Orders', content: <p className='text-sm text-gray-600'>Recent orders list.</p> },
      { value: 'history', label: 'History', content: <p className='text-sm text-gray-600'>Past orders history.</p> },
      { value: 'settings', label: 'Settings', content: <p className='text-sm text-gray-600'>User preferences.</p> },
    ],
  },
}

export const WithDisabled: Story = {
  args: {
    tabs: [
      { value: 'active', label: 'Active', content: <p className='text-sm text-gray-600'>Active tab.</p> },
      { value: 'locked', label: 'Locked', content: <p>Not accessible.</p>, disabled: true },
      { value: 'other', label: 'Other', content: <p className='text-sm text-gray-600'>Another tab.</p> },
    ],
  },
}

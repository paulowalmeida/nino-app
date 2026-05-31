import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'
import { Menu } from './Menu'

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Menu>

export const Default: Story = {
  args: {
    trigger: <Button variant='outline'>Actions</Button>,
    items: [
      { value: 'edit', label: 'Edit' },
      { value: 'duplicate', label: 'Duplicate' },
      { separator: true },
      { value: 'delete', label: 'Delete', destructive: true },
    ],
  },
}

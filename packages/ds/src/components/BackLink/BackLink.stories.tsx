import type { Meta, StoryObj } from '@storybook/react'

import { BackLink } from './BackLink'

const meta: Meta<typeof BackLink> = {
  title: 'Components/BackLink',
  component: BackLink,
  tags: ['autodocs'],
  args: { href: '/orders', children: 'Orders' },
  argTypes: {
    href: {
      control: 'text',
      description:
        'Resolved destination — the app resolves relative routing and passes the final href',
    },
    onClick: {
      control: false,
      description: 'App wires this to its own router navigation',
    },
    children: { control: 'text', description: 'Link label' },
  },
}

export default meta
type Story = StoryObj<typeof BackLink>

export const Default: Story = {}

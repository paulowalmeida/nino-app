import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    loadingIndicator: { control: 'select', options: ['spinner', 'dots'] },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Confirm order' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'View details' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Dismiss' },
}

export const LoadingSpinner: Story = {
  args: {
    variant: 'primary',
    loading: true,
    loadingIndicator: 'spinner',
    children: 'Saving...',
  },
}

export const LoadingDots: Story = {
  args: {
    variant: 'primary',
    loading: true,
    loadingIndicator: 'dots',
    children: 'Saving...',
  },
}

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Unavailable' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
}

export const AsLink: Story = {
  render: () => (
    <Button asChild variant="outline">
      <a href="/menu">View menu</a>
    </Button>
  ),
}

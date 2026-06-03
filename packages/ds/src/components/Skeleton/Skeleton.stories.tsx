import type { Meta, StoryObj } from '@storybook/react'

import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['rect', 'circle', 'text'] },
    animation: { control: 'select', options: ['pulse', 'wave', 'none'] },
  },
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  args: { className: 'w-48 h-6' },
}

export const Pulse: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Skeleton variant="text" animation="pulse" />
      <Skeleton variant="text" animation="pulse" className="w-3/4" />
      <Skeleton variant="rect" animation="pulse" className="w-full h-32" />
    </div>
  ),
}

export const Wave: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Skeleton variant="text" animation="wave" />
      <Skeleton variant="text" animation="wave" className="w-3/4" />
      <Skeleton variant="rect" animation="wave" className="w-full h-32" />
    </div>
  ),
}

export const NoAnimation: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Skeleton variant="text" animation="none" />
      <Skeleton variant="text" animation="none" className="w-3/4" />
      <Skeleton variant="rect" animation="none" className="w-full h-32" />
    </div>
  ),
}

export const CardPlaceholder: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg w-80">
        <Skeleton variant="circle" animation="pulse" className="w-12 h-12 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton variant="text" animation="pulse" />
          <Skeleton variant="text" animation="pulse" className="w-3/4" />
          <Skeleton variant="text" animation="pulse" className="w-1/2" />
        </div>
      </div>
      <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg w-80">
        <Skeleton variant="circle" animation="wave" className="w-12 h-12 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" className="w-3/4" />
          <Skeleton variant="text" animation="wave" className="w-1/2" />
        </div>
      </div>
    </div>
  ),
}

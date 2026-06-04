import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'
import { Tooltip, TooltipProvider } from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex items-center justify-center p-16">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {
    content: 'Contextual hint',
    children: <Button variant="outline">Hover me</Button>,
  },
}

export const Sides: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-4">
        {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
          <Tooltip key={side} content={`Side: ${side}`} side={side}>
            <Button variant="secondary" size="sm">
              {side}
            </Button>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
}

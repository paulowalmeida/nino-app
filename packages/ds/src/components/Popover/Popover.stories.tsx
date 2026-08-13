import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button/Button'
import { Popover } from './Popover'

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <div className="flex justify-center p-20">
      <Popover
        trigger={<Button variant="outline">More info</Button>}
        title="About delivery"
      >
        We deliver within 45 minutes inside the coverage area. Fee calculated
        based on distance.
      </Popover>
    </div>
  ),
}

export const NoTitle: Story = {
  render: () => (
    <div className="flex justify-center p-20">
      <Popover
        trigger={
          <Button variant="ghost" size="sm">
            ?
          </Button>
        }
      >
        This field is required for invoice generation.
      </Popover>
    </div>
  ),
}

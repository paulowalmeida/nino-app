import type { Meta, StoryObj } from '@storybook/react'

import { Clipboard } from './Clipboard'

const meta: Meta<typeof Clipboard> = {
  title: 'Components/Clipboard',
  component: Clipboard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Clipboard>

export const Default: Story = {
  args: { value: '00020126580014br.gov.bcb.pix0136...' },
  render: (args) => (
    <div className="w-96">
      <Clipboard {...args} />
    </div>
  ),
}

import type { Meta, StoryObj } from '@storybook/react'

import { Eyebrow } from './Eyebrow'

const meta: Meta<typeof Eyebrow> = {
  title: 'Components/Eyebrow',
  component: Eyebrow,
  tags: ['autodocs'],
  args: { children: 'New' },
  argTypes: {
    children: { control: 'text', description: 'Label text' },
  },
}

export default meta
type Story = StoryObj<typeof Eyebrow>

export const Default: Story = {}

/** As it appears above a section heading. */
export const AboveAHeading: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Eyebrow {...args} />
      <h2 className="text-2xl font-extrabold">Section title</h2>
    </div>
  ),
}

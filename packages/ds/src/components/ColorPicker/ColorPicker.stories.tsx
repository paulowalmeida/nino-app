import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { ColorPicker } from './ColorPicker'

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ColorPicker>

export const Default: Story = {
  render: (args) => {
    const [color, setColor] = useState('#FF6B00')

    return (
      <div className="p-8">
        <ColorPicker {...args} value={color} onValueChange={setColor} />
      </div>
    )
  },
}

export const WithThePickedTintOnDisplay: Story = {
  render: () => {
    const [color, setColor] = useState('#FF6B00')

    return (
      <div className="flex flex-col gap-3 p-8">
        <div className="h-16 rounded-2" style={{ backgroundColor: color }} />
        <ColorPicker value={color} onValueChange={setColor} />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="p-8">
      <ColorPicker value="#FF6B00" disabled />
    </div>
  ),
}

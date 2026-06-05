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
  render: () => (
    <div className="p-8">
      <ColorPicker defaultValue="#FF6B00" />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [color, setColor] = useState('#FF6B00')
    return (
      <div className="flex flex-col gap-3 p-8">
        <ColorPicker value={color} onValueChange={setColor} />
        <p className="text-sm text-gray-600">
          Cor da loja: <span className="font-mono">{color}</span>
        </p>
      </div>
    )
  },
}

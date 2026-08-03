import type { Meta, StoryObj } from '@storybook/react'

import { NinoMascot } from './NinoMascot'

const meta: Meta<typeof NinoMascot> = {
  title: 'Components/NinoMascot',
  component: NinoMascot,
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text', description: 'Sizing/positioning classes' },
  },
}

export default meta
type Story = StoryObj<typeof NinoMascot>

export const Default: Story = {
  render: (args) => <NinoMascot {...args} className="h-32 w-32" />,
}

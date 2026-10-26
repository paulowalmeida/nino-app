import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { DatePicker } from './DatePicker'

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex flex-col items-center gap-4 p-8">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>()
    return (
      <div className="w-72 flex justify-center">
        <DatePicker {...args} value={date} onValueChange={setDate} />
      </div>
    )
  },
}

export const WithValue: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <div className="w-72 flex justify-center">
        <DatePicker value={date} onValueChange={setDate} />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-72 flex justify-center">
      <DatePicker disabled placeholder="Campo desabilitado" />
    </div>
  ),
}

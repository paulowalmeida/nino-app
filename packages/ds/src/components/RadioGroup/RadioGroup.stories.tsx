import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { RadioGroup } from './RadioGroup'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

const paymentOptions = [
  { value: 'pix', label: 'Pix' },
  { value: 'card', label: 'Credit card' },
  { value: 'cash', label: 'Cash' },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('pix')
    return (
      <RadioGroup
        options={paymentOptions}
        value={value}
        onValueChange={setValue}
      />
    )
  },
}

export const Horizontal: Story = {
  render: () => {
    const [value, setValue] = useState('pix')
    return (
      <RadioGroup
        options={paymentOptions}
        orientation='horizontal'
        value={value}
        onValueChange={setValue}
      />
    )
  },
}

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup
      options={[
        { value: 'pix', label: 'Pix' },
        { value: 'card', label: 'Credit card (unavailable)', disabled: true },
        { value: 'cash', label: 'Cash' },
      ]}
      defaultValue='pix'
    />
  ),
}

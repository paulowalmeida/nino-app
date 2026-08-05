import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Chip } from './Chip'

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['tab', 'toggle'] },
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {
  args: { variant: 'toggle', selected: false, children: 'Pix' },
}

export const Tabs: Story = {
  render: () => {
    const [value, setValue] = useState('a')
    return (
      <div role="tablist" className="flex gap-2">
        {['a', 'b', 'c'].map((option) => (
          <Chip
            key={option}
            variant="tab"
            selected={value === option}
            onClick={() => setValue(option)}
          >
            Categoria {option.toUpperCase()}
          </Chip>
        ))}
      </div>
    )
  },
}

export const Toggles: Story = {
  render: () => {
    const [selected, setSelected] = useState(['pix'])
    const toggle = (method: string) =>
      setSelected((current) =>
        current.includes(method)
          ? current.filter((value) => value !== method)
          : [...current, method]
      )

    return (
      <div className="flex flex-wrap gap-2">
        {['pix', 'cartão', 'dinheiro'].map((method) => (
          <Chip
            key={method}
            variant="toggle"
            selected={selected.includes(method)}
            onClick={() => toggle(method)}
          >
            {method}
          </Chip>
        ))}
      </div>
    )
  },
}

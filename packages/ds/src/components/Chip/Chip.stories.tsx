import { ReactNode, useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Chip } from './Chip'

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['tab', 'toggle'] },
    children: {
      description:
        'Label of the chip. The tab demo brings its own pair of labels, ' +
        'since a tab only means something next to its siblings.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Chip>

type ChipPlaygroundProps = {
  variant: 'tab' | 'toggle'
  selected: boolean
  borderless?: boolean
  label: ReactNode
}

const ChipPlayground = ({
  variant,
  selected,
  borderless,
  label,
}: ChipPlaygroundProps) => {
  const [isPressed, setIsPressed] = useState(selected)
  const [activeTab, setActiveTab] = useState(selected ? 'delivery' : 'pickup')

  if (variant === 'tab') {
    return (
      <div role="tablist" className="flex gap-2">
        <Chip
          variant="tab"
          selected={activeTab === 'delivery'}
          borderless={borderless}
          onClick={() => setActiveTab('delivery')}
        >
          Entrega
        </Chip>
        <Chip
          variant="tab"
          selected={activeTab === 'pickup'}
          borderless={borderless}
          onClick={() => setActiveTab('pickup')}
        >
          Retirada
        </Chip>
      </div>
    )
  }

  return (
    <Chip
      variant="toggle"
      selected={isPressed}
      borderless={borderless}
      onClick={() => setIsPressed((current) => !current)}
    >
      {label}
    </Chip>
  )
}

export const Default: Story = {
  args: {
    variant: 'toggle',
    selected: false,
    borderless: true,
    children: 'Pix',
  },
  render: ({ variant, selected, borderless, children }) => (
    <ChipPlayground
      key={`${variant}-${String(selected)}-${String(borderless)}`}
      variant={variant}
      selected={selected}
      borderless={borderless}
      label={children}
    />
  ),
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

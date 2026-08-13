import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { QuantityStepper } from './QuantityStepper'

const meta: Meta<typeof QuantityStepper> = {
  title: 'Components/QuantityStepper',
  component: QuantityStepper,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    decrementIcon: { control: 'select', options: ['minus', 'trash'] },
  },
}

export default meta
type Story = StoryObj<typeof QuantityStepper>

export const Default: Story = {
  render: () => {
    const [quantity, setQuantity] = useState(1)

    return (
      <QuantityStepper
        quantity={quantity}
        onIncrement={() => setQuantity((current) => current + 1)}
        onDecrement={() => setQuantity((current) => Math.max(1, current - 1))}
        incrementLabel="Aumentar quantidade"
        decrementLabel="Diminuir quantidade"
        isDecrementDisabled={quantity <= 1}
      />
    )
  },
}

export const RemovesOnLastUnit: Story = {
  render: () => {
    const [quantity, setQuantity] = useState(2)

    return (
      <QuantityStepper
        size="sm"
        quantity={quantity}
        onIncrement={() => setQuantity((current) => current + 1)}
        onDecrement={() => setQuantity((current) => Math.max(0, current - 1))}
        incrementLabel="Adicionar mais uma unidade de Pizza"
        decrementLabel={
          quantity === 1 ? 'Remover Pizza da sacola' : 'Remover uma unidade'
        }
        decrementIcon={quantity === 1 ? 'trash' : 'minus'}
      />
    )
  },
}

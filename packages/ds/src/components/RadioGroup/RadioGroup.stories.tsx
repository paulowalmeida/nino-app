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
  args: { options: paymentOptions },
  render: (args) => {
    const [value, setValue] = useState('pix')
    return <RadioGroup {...args} value={value} onValueChange={setValue} />
  },
}

export const Horizontal: Story = {
  render: () => {
    const [value, setValue] = useState('pix')
    return (
      <RadioGroup
        options={paymentOptions}
        orientation="horizontal"
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
      defaultValue="pix"
    />
  ),
}

/**
 * Each option becomes a surface of its own. For choices that carry a
 * consequence — a delivery fee, a wait — and deserve a bigger touch target.
 */
export const Cards: Story = {
  render: () => (
    <div className="w-96">
      <RadioGroup
        variant="card"
        orientation="horizontal"
        defaultValue="DELIVERY"
        options={[
          {
            value: 'DELIVERY',
            label: 'Entrega',
            description: 'Chega em ~40 min',
          },
          {
            value: 'PICKUP',
            label: 'Retirada',
            description: 'Você busca na loja',
          },
        ]}
      />
    </div>
  ),
}

export const CardsStacked: Story = {
  render: () => (
    <div className="w-80">
      <RadioGroup
        variant="card"
        defaultValue="pix"
        options={[
          { value: 'pix', label: 'Pix', description: 'Confirmação na hora' },
          {
            value: 'cash',
            label: 'Dinheiro',
            description: 'Combine o troco com a loja',
          },
          {
            value: 'card',
            label: 'Cartão na entrega',
            description: 'Maquininha indisponível hoje',
            disabled: true,
          },
        ]}
      />
    </div>
  ),
}

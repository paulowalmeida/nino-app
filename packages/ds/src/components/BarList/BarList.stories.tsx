import type { Meta, StoryObj } from '@storybook/react'

import { BarList } from './BarList'

const meta: Meta<typeof BarList> = {
  title: 'Components/BarList',
  component: BarList,
  tags: ['autodocs'],
  argTypes: {
    items: { control: false, description: 'Rows, already in display order' },
    max: {
      control: 'number',
      description: 'Scale ceiling. Defaults to the largest value',
    },
  },
}

export default meta
type Story = StoryObj<typeof BarList>

const TOP = [
  { id: '1', label: 'X-Burguer da casa', value: 42, display: 'R$ 1.260' },
  { id: '2', label: 'Batata frita grande', value: 31, display: 'R$ 620' },
  { id: '3', label: 'Milkshake de ovomaltine', value: 18, display: 'R$ 450' },
]

export const Default: Story = {
  args: { items: TOP },
  render: (args) => (
    <div className="w-80">
      <BarList {...args} />
    </div>
  ),
}

/** Como aparece na Visão geral: dentro do cartão, sob um rótulo. */
export const InACard: Story = {
  render: () => (
    <div className="w-80 rounded-card border border-line/60 bg-white p-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-faint">
        O que mais sai hoje
      </p>
      <BarList items={TOP} />
    </div>
  ),
}

/**
 * Nome longo não empurra o valor nem quebra a linha: ele é cortado, e o valor
 * fica sempre à direita, onde a leitura procura.
 */
export const LongNames: Story = {
  render: () => (
    <div className="w-72">
      <BarList
        items={[
          {
            id: '1',
            label: 'Combo família com fritas, refrigerante e sobremesa',
            value: 12,
            display: 'R$ 840',
          },
          { id: '2', label: 'Água', value: 4, display: 'R$ 20' },
        ]}
      />
    </div>
  ),
}

/** Teto explícito: as barras passam a se ler contra a meta, não entre si. */
export const AgainstATarget: Story = {
  render: () => (
    <div className="w-80">
      <BarList items={TOP} max={100} />
    </div>
  ),
}

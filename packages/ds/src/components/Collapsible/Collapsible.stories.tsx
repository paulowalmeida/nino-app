import type { Meta, StoryObj } from '@storybook/react'

import { Collapsible } from './Collapsible'

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Collapsible trigger="Detalhes do pedido">
        <p>2× X-Burgão Especial · R$ 57,80</p>
        <p>1× Combo Família · R$ 69,90</p>
      </Collapsible>
    </div>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <div className="w-80">
      <Collapsible trigger="Formas de pagamento" defaultOpen>
        Pix, cartão de crédito e dinheiro na entrega.
      </Collapsible>
    </div>
  ),
}

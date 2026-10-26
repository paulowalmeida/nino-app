import type { Meta, StoryObj } from '@storybook/react'

import { Collapsible } from './Collapsible'

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  args: { trigger: 'Detalhes do pedido', indicator: true },
  render: (args) => (
    <div className="w-80">
      <Collapsible {...args}>
        <p>2× X-Burgão Especial · R$ 57,80</p>
        <p>1× Combo Família · R$ 69,90</p>
      </Collapsible>
    </div>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <div className="w-80">
      <Collapsible trigger="Formas de pagamento" defaultOpen indicator>
        Pix, cartão de crédito e dinheiro na entrega.
      </Collapsible>
    </div>
  ),
}

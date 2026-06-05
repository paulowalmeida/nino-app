import type { Meta, StoryObj } from '@storybook/react'

import { Listbox } from './Listbox'

const meta: Meta<typeof Listbox> = {
  title: 'Components/Listbox',
  component: Listbox,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Listbox>

const options = [
  { value: 'pix', label: 'Pix' },
  { value: 'credit', label: 'Cartão de crédito' },
  { value: 'cash', label: 'Dinheiro na entrega' },
  { value: 'voucher', label: 'Vale-refeição', disabled: true },
]

export const Single: Story = {
  render: () => (
    <div className="w-64">
      <Listbox
        label="Forma de pagamento"
        options={options}
        defaultValue={['pix']}
      />
    </div>
  ),
}

export const Multiple: Story = {
  render: () => (
    <div className="w-64">
      <Listbox
        label="Aceitar pagamentos"
        options={options}
        selectionMode="multiple"
        defaultValue={['pix', 'credit']}
      />
    </div>
  ),
}

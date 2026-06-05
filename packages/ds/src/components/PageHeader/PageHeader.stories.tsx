import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'
import { PageHeader } from './PageHeader'

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  render: () => (
    <div className="w-[640px]">
      <PageHeader
        title="Pedidos"
        description="Acompanhe e gerencie os pedidos da sua loja."
        actions={<Button>Novo pedido</Button>}
      />
    </div>
  ),
}

export const TitleOnly: Story = {
  render: () => (
    <div className="w-[640px]">
      <PageHeader title="Configurações" />
    </div>
  ),
}

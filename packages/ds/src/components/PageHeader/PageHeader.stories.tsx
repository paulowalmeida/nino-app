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

/**
 * The peach underline sits behind one word of the title — the one carrying the
 * subject. It comes from the landing, and it is what makes a panel screen read
 * as the same product as the site.
 */
export const WithAccent: Story = {
  render: () => (
    <div className="flex w-[640px] flex-col gap-8">
      <PageHeader
        title="Quem toca a equipe"
        accent="equipe"
        description="Cada pessoa entra com a própria conta."
      />
      <PageHeader title="Meus dados" accent="dados" />
      <PageHeader title="Cardápio" accent="Cardápio" />
    </div>
  ),
}

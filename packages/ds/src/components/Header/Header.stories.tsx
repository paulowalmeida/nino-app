import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button/Button'
import { Header } from './Header'

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    size: {
      control: 'select',
      options: [undefined, 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Header>

export const Default: Story = {
  render: () => (
    <div className="w-[640px]">
      <Header
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
      <Header title="Configurações" />
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
      <Header
        title="Quem toca a equipe"
        accent="equipe"
        description="Cada pessoa entra com a própria conta."
      />
      <Header title="Meus dados" accent="dados" />
      <Header title="Cardápio" accent="Cardápio" />
    </div>
  ),
}

/**
 * A screen only gets one `h1`. A header mounted inside a page that already
 * has one takes a lower `level` — the title keeps its weight through `size`
 * while the outline stays honest.
 */
export const LevelApartFromSize: Story = {
  render: () => (
    <div className="w-[640px]">
      <Header title="Assinatura e plano" level={2} size="xl" />
    </div>
  ),
}

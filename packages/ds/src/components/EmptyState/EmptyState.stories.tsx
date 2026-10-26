import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button/Button'
import { EmptyState } from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md'],
      description: 'Compact inside a card, or filling a whole screen',
    },
    title: { control: 'text', description: 'Short heading' },
    illustration: {
      control: false,
      description: 'Drawing above the title — only rendered at md',
    },
    action: { control: false, description: 'Way out of the dead end' },
  },
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: { children: 'Nenhum telefone cadastrado.' },
}

export const WithTitle: Story = {
  args: {
    title: 'Nenhuma região cadastrada',
    children: 'Sem zona de entrega, a loja não cobra pela entrega.',
  },
}

export const WithAction: Story = {
  args: {
    title: 'Seu cardápio está vazio',
    children: 'Cadastre o primeiro item para começar a vender.',
    action: <Button size="sm">Cadastrar item</Button>,
  },
}

const Mascot = () => (
  <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
    <circle cx="48" cy="48" r="44" className="fill-surface-4" />
    <circle cx="36" cy="42" r="5" className="fill-fg-strong" />
    <circle cx="60" cy="42" r="5" className="fill-fg-strong" />
    <path
      d="M34 62c8 6 20 6 28 0"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      className="text-brand"
    />
  </svg>
)

export const FullScreen: Story = {
  args: {
    size: 'md',
    illustration: <Mascot />,
    title: 'Sua sacola está vazia',
    children: 'Volte ao cardápio e escolha o que vai pedir.',
    action: <Button>Ver o cardápio</Button>,
  },
}

export const BothSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="rounded-2 border border-border bg-surface-raised p-4">
        <p className="text-sm font-semibold text-fg-strong">Telefones</p>
        <EmptyState>Nenhum telefone cadastrado.</EmptyState>
      </div>

      <div className="rounded-2 border border-border bg-surface-raised">
        <EmptyState
          size="md"
          illustration={<Mascot />}
          title="Loja não encontrada"
          action={<Button variant="outline">Voltar</Button>}
        >
          Confira o link — o endereço pode ter mudado ou a loja saiu do ar.
        </EmptyState>
      </div>
    </div>
  ),
}

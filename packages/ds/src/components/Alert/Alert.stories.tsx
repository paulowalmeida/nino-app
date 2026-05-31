import type { Meta, StoryObj } from '@storybook/react'

import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
  },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  args: { children: 'Esta é uma mensagem informativa.' },
}

export const ComTitulo: Story = {
  args: {
    variant: 'success',
    title: 'Pedido confirmado',
    children: 'Seu pedido foi recebido e está sendo preparado.',
  },
}

export const Variantes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Alert variant="info" title="Informação">
        Seus dados estão sendo processados.
      </Alert>
      <Alert variant="success" title="Sucesso">
        Alterações salvas com sucesso.
      </Alert>
      <Alert variant="warning" title="Atenção">
        Você está prestes a excluir este item.
      </Alert>
      <Alert variant="error" title="Erro">
        Não foi possível completar a operação.
      </Alert>
    </div>
  ),
}

export const SemTitulo: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Alert variant="info">Apenas uma nota informativa.</Alert>
      <Alert variant="error">Algo deu errado. Tente novamente.</Alert>
    </div>
  ),
}

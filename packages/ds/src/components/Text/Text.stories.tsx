import type { Meta, StoryObj } from '@storybook/react'

import { Text } from './Text'

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    as: { control: 'select', options: ['p', 'span', 'strong', 'em'] },
    size: { control: 'select', options: ['xs', 'sm', 'base', 'lg'] },
    color: {
      control: 'select',
      options: [
        'strong',
        'default',
        'muted',
        'subtle',
        'faint',
        'faintest',
        'brand',
        'brand-strong',
        'success',
        'danger',
        'warning',
      ],
    },
    align: { control: 'select', options: ['left', 'center', 'right'] },
    case: {
      control: 'select',
      options: [undefined, 'uppercase', 'lowercase', 'capitalize'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Text>

export const Default: Story = {
  args: { children: 'Atualizado há 2 min' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text size="lg">lg — texto de apoio maior</Text>
      <Text size="base">base — corpo padrão do app</Text>
      <Text size="sm">sm — apoio, legenda de campo</Text>
      <Text size="xs">xs — carimbo, dado secundário</Text>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <Text color="strong">ink</Text>
      <Text color="default">body</Text>
      <Text color="muted">muted</Text>
      <Text color="subtle">subtle</Text>
      <Text color="faint">faint</Text>
      <Text color="faintest">faintest</Text>
      <Text color="brand">brand</Text>
      <Text color="brand-strong">brand-strong</Text>
      <Text color="success">success</Text>
      <Text color="danger">danger</Text>
      <Text color="warning">warning</Text>
    </div>
  ),
}

export const Tags: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text>Bloco próprio, ocupa a linha inteira</Text>
      <Text>
        Total do pedido:{' '}
        <Text as="span" color="brand-strong">
          R$ 42,00
        </Text>{' '}
        — o span fica dentro da frase
      </Text>
      <Text>
        Entrega <Text as="strong">até 40 minutos</Text> a partir da confirmação
      </Text>
    </div>
  ),
}

export const Align: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text align="left">Alinhado à esquerda</Text>
      <Text align="center">Alinhado ao centro</Text>
      <Text align="right">Alinhado à direita</Text>
    </div>
  ),
}

export const Case: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text size="sm" color="faint" case="uppercase">
        Observações
      </Text>
      <Text case="lowercase">TEXTO EM CAIXA BAIXA</Text>
      <Text case="capitalize">texto com cada palavra maiúscula</Text>
    </div>
  ),
}

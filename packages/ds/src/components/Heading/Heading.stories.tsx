import type { Meta, StoryObj } from '@storybook/react'

import { Heading } from './Heading'

const meta: Meta<typeof Heading> = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'select', options: [undefined, 'sm', 'md', 'lg', 'xl'] },
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
  },
}

export default meta
type Story = StoryObj<typeof Heading>

export const Default: Story = {
  args: { level: 1, children: 'Configurações' },
}

export const Levels: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Heading level={1}>Nível 1 — título da página</Heading>
      <Heading level={2}>Nível 2 — seção</Heading>
      <Heading level={3}>Nível 3 — bloco dentro da seção</Heading>
      <Heading level={4}>Nível 4 — subdivisão</Heading>
    </div>
  ),
}

/* O caso que separa estrutura de aparência: os três blocos pesam como
 * título de página, mas entram no índice como nível 3 — a página já gastou
 * o h1 no cabeçalho. */
export const SizeApartFromLevel: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Heading level={1}>Visão geral</Heading>
      <div className="flex gap-8">
        <Heading level={3} size="xl">
          R$ 1.240
        </Heading>
        <Heading level={3} size="xl">
          38 pedidos
        </Heading>
        <Heading level={3} size="xl">
          R$ 32,60
        </Heading>
      </div>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Heading level={2} color="strong">
        strong — padrão
      </Heading>
      <Heading level={2} color="brand-strong">
        brand-strong
      </Heading>
      <Heading level={2} color="danger">
        danger
      </Heading>
    </div>
  ),
}

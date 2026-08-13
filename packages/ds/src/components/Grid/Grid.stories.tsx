import type { Meta, StoryObj } from '@storybook/react'

import { Grid } from './Grid'

const meta: Meta<typeof Grid> = {
  title: 'Components/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'section', 'ul', 'ol'],
    },
    columns: { control: 'select', options: [1, 2, 3, 4, 5, 6, 12] },
    gap: {
      control: 'select',
      options: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Grid>

const Cell = ({ children }: { children: string }) => (
  <div className="rounded-2 bg-surface-2 px-4 py-6 text-center">{children}</div>
)

export const Default: Story = {
  render: () => (
    <Grid columns={3} gap={3}>
      <Cell>1</Cell>
      <Cell>2</Cell>
      <Cell>3</Cell>
      <Cell>4</Cell>
      <Cell>5</Cell>
      <Cell>6</Cell>
    </Grid>
  ),
}

/**
 * A grade das telas: uma coluna no celular, três no desktop. É a forma dos
 * cartões de resumo e da lista de produtos.
 */
export const Responsive: Story = {
  render: () => (
    <Grid columns={{ mobile: 1, desktop: 3 }} gap={{ mobile: 2, desktop: 4 }}>
      <Cell>Pedidos hoje</Cell>
      <Cell>Faturamento</Cell>
      <Cell>Ticket médio</Cell>
    </Grid>
  ),
}

/**
 * Largura de coluna que não é fração igual continua no CSS da tela: ali a
 * medida pertence àquele layout, não a uma escala.
 */
export const CustomColumns: Story = {
  render: () => (
    <Grid gap={4} className="lg:grid-cols-[20rem_1fr]">
      <Cell>coluna fixa</Cell>
      <Cell>o que sobra</Cell>
    </Grid>
  ),
}

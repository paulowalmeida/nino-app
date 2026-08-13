import type { Meta, StoryObj } from '@storybook/react'

import { Heading } from '../Heading/Heading'
import { Text } from '../Text/Text'
import { Flexbox } from './Flexbox'

const meta: Meta<typeof Flexbox> = {
  title: 'Components/Flexbox',
  component: Flexbox,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'section', 'header', 'nav', 'ul'],
    },
    direction: { control: 'select', options: ['column', 'row'] },
    gap: {
      control: 'select',
      options: [0, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end', 'between', 'around'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Flexbox>

const Block = ({ children }: { children: string }) => (
  <div className="rounded-2 bg-surface-2 px-4 py-2">{children}</div>
)

export const Default: Story = {
  render: () => (
    <Flexbox gap={2}>
      <Block>Primeiro</Block>
      <Block>Segundo</Block>
      <Block>Terceiro</Block>
    </Flexbox>
  ),
}

export const Row: Story = {
  render: () => (
    <Flexbox direction="row" gap={2}>
      <Block>Primeiro</Block>
      <Block>Segundo</Block>
      <Block>Terceiro</Block>
    </Flexbox>
  ),
}

/**
 * The shape most screens repeat: title and supporting line stacked with a
 * half-step gap between them.
 */
export const ScreenHeading: Story = {
  render: () => (
    <Flexbox gap={1.5}>
      <Heading level={1}>Cardápio</Heading>
      <Text color="subtle">
        Desligue o que acabou — o item some do app do cliente na hora.
      </Text>
    </Flexbox>
  ),
}

/**
 * Column on the phone, row on the desktop — the same switch the screens
 * were writing by hand with `lg:` prefixes.
 */
export const Responsive: Story = {
  render: () => (
    <Flexbox
      direction={{ mobile: 'column', desktop: 'row' }}
      gap={{ mobile: 2, desktop: 6 }}
    >
      <Block>Primeiro</Block>
      <Block>Segundo</Block>
      <Block>Terceiro</Block>
    </Flexbox>
  ),
}

export const Justify: Story = {
  render: () => (
    <Flexbox direction="row" justify="between" align="center">
      <Heading level={2}>Pedidos</Heading>
      <Block>ação</Block>
    </Flexbox>
  ),
}

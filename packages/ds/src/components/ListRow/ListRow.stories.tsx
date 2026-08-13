import type { Meta, StoryObj } from '@storybook/react'

import { Flexbox } from '../Flexbox/Flexbox'
import { Text } from '../Text/Text'
import { ListRow } from './ListRow'

const meta: Meta<typeof ListRow> = {
  title: 'Components/ListRow',
  component: ListRow,
  tags: ['autodocs'],
  argTypes: {
    divider: { control: 'select', options: ['top', 'bottom', 'none'] },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'baseline'],
    },
    gap: { control: 'select', options: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6] },
    padding: { control: 'select', options: [0, 1, 1.5, 2, 2.5, 3, 4] },
  },
}

export default meta
type Story = StoryObj<typeof ListRow>

const zones = [
  { name: 'Centro', fee: 'R$ 5,00' },
  { name: 'Zona Sul', fee: 'R$ 8,00' },
  { name: 'Zona Norte', fee: 'R$ 9,50' },
]

export const Default: Story = {
  render: (args) => (
    <Flexbox as="ul" className="w-96">
      {zones.map((zone) => (
        <ListRow key={zone.name} {...args}>
          <Text className="flex-1">{zone.name}</Text>
          <Text color="muted">{zone.fee}</Text>
        </ListRow>
      ))}
    </Flexbox>
  ),
}

/**
 * A divisória no topo é o padrão porque a primeira linha encosta no que veio
 * antes, e nenhuma sobra com um risco solto embaixo.
 */
export const Dividers: Story = {
  render: () => (
    <Flexbox gap={8} className="w-96">
      <Flexbox as="ul">
        {zones.map((zone) => (
          <ListRow key={zone.name}>
            <Text>{zone.name}</Text>
          </ListRow>
        ))}
      </Flexbox>
      <Flexbox as="ul">
        {zones.map((zone) => (
          <ListRow key={zone.name} divider="bottom">
            <Text>{zone.name}</Text>
          </ListRow>
        ))}
      </Flexbox>
    </Flexbox>
  ),
}

/**
 * `baseline` para quando textos de tamanhos diferentes precisam assentar na
 * mesma linha — nome grande e valor pequeno, por exemplo.
 */
export const Baseline: Story = {
  render: () => (
    <Flexbox as="ul" className="w-96">
      <ListRow align="baseline">
        <Text size="lg" weight="semibold" className="flex-1">
          X-Burguer
        </Text>
        <Text size="xs" color="muted">
          42 vendidos
        </Text>
      </ListRow>
    </Flexbox>
  ),
}

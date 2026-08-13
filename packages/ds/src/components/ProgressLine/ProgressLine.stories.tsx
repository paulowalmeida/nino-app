import type { Meta, StoryObj } from '@storybook/react'

import { Flexbox } from '../Flexbox/Flexbox'
import { ProgressLine } from './ProgressLine'

const meta: Meta<typeof ProgressLine> = {
  title: 'Components/ProgressLine',
  component: ProgressLine,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
}

export default meta
type Story = StoryObj<typeof ProgressLine>

export const Default: Story = {
  args: { value: 60, label: 'Cadastro' },
}

export const Sizes: Story = {
  render: () => (
    <Flexbox gap={4}>
      <ProgressLine value={30} size="sm" label="Fino" />
      <ProgressLine value={60} size="md" label="Padrão" />
      <ProgressLine value={80} size="lg" label="Grosso" />
    </Flexbox>
  ),
}

export const Indeterminate: Story = {
  args: { value: null, size: 'md', label: 'Enviando' },
}

export const Complete: Story = {
  args: { value: 100, size: 'md', label: 'Concluído' },
}

import type { Meta, StoryObj } from '@storybook/react'

import { Sparkline } from './Sparkline'

const meta: Meta<typeof Sparkline> = {
  title: 'Components/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  argTypes: {
    values: { control: false, description: 'Series in time order' },
    label: { control: 'text', description: 'Accessible name of the chart' },
    height: { control: { type: 'range', min: 16, max: 96, step: 4 } },
  },
}

export default meta
type Story = StoryObj<typeof Sparkline>

const WEEK = [1240, 980, 1530, 1410, 2100, 1870, 2340]

export const Default: Story = {
  args: { values: WEEK, label: 'Faturamento nos últimos 7 dias' },
  render: (args) => (
    <div className="w-64">
      <Sparkline {...args} />
    </div>
  ),
}

/**
 * O uso para o qual foi feito: encostado num número, dando forma à série sem
 * disputar leitura com ele.
 */
export const BesideAFigure: Story = {
  render: () => (
    <div className="w-64 rounded-2 border border-border bg-surface-raised p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-fg-faint">
        Faturamento
      </p>
      <p className="mt-1 font-display text-3xl font-extrabold text-fg-strong tabular-nums">
        R$ 2.340
      </p>
      <div className="mt-3">
        <Sparkline values={WEEK} label="Faturamento nos últimos 7 dias" />
      </div>
    </div>
  ),
}

/** A cor vem de `currentColor` — a classe de texto manda. */
export const Tones: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-6">
      <Sparkline values={WEEK} label="Em laranja" />
      <Sparkline values={WEEK} label="Em verde" className="text-success" />
      <Sparkline values={WEEK} label="Em vermelho" className="text-danger" />
    </div>
  ),
}

/** Série sem variação assenta no meio em vez de dividir por zero. */
export const Flat: Story = {
  render: () => (
    <div className="w-64">
      <Sparkline values={[900, 900, 900, 900]} label="Sem variação" />
    </div>
  ),
}

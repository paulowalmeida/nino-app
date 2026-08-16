import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  ChartSeriesTooltip,
} from '@molecules/ChartSeriesTooltip/ChartSeriesTooltip'

describe(ChartSeriesTooltip.name, () => {
  it('shows one row per line, each with its label and value', () => {
    // Arrange / Act
    render(
      <ChartSeriesTooltip
        at={new Date('2026-07-01T14:30:00Z')}
        lines={[
          { key: 'DELIVERY', label: 'Entrega', value: 'R$ 150,00' },
          { key: 'PICKUP', label: 'Retirada', value: 'R$ 50,00' },
        ]}
      />
    )

    // Assert
    expect(screen.getByText('Entrega')).toBeInTheDocument()
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument()
    expect(screen.getByText('Retirada')).toBeInTheDocument()
    expect(screen.getByText('R$ 50,00')).toBeInTheDocument()
  })

  it('shows only the date label with no lines', () => {
    // Arrange / Act
    render(
      <ChartSeriesTooltip at={new Date('2026-07-01T14:30:00Z')} lines={[]} />
    )

    // Assert
    expect(screen.queryByText('R$', { exact: false })).not.toBeInTheDocument()
  })
})

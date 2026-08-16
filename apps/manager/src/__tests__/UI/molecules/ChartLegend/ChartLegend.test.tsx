import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ChartLegend } from '@molecules/ChartLegend/ChartLegend'

describe(ChartLegend.name, () => {
  it('renders one entry per item, each with its label', () => {
    // Arrange / Act
    render(
      <ChartLegend
        items={[
          { key: 'DELIVERY', label: 'Entrega' },
          { key: 'PICKUP', label: 'Retirada' },
        ]}
      />
    )

    // Assert
    expect(screen.getByText('Entrega')).toBeInTheDocument()
    expect(screen.getByText('Retirada')).toBeInTheDocument()
  })

  it('renders nothing with an empty item list', () => {
    // Arrange / Act
    render(<ChartLegend items={[]} />)

    // Assert
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })
})

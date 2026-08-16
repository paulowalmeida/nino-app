import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  SalesTrendByDimension,
} from '@organisms/SalesTrendByDimension/SalesTrendByDimension'

import { emptyBreakdown, twoDayBreakdown } from './SalesTrendByDimension.mock'

const labelOf = (key: string): string =>
  key === 'DELIVERY' ? 'Entrega' : key

describe(SalesTrendByDimension.name, () => {
  it('shows the empty state with no sales in the period', () => {
    // Arrange / Act
    render(
      <SalesTrendByDimension
        title="Faturamento por canal"
        breakdown={emptyBreakdown}
        isPending={false}
        labelOf={labelOf}
        emptyMessage="Nenhuma venda concluída no período."
      />
    )

    // Assert
    expect(
      screen.getByText('Nenhuma venda concluída no período.')
    ).toBeInTheDocument()
  })

  it('draws the chart when the period has sales', () => {
    // Arrange / Act
    render(
      <SalesTrendByDimension
        title="Faturamento por canal"
        breakdown={twoDayBreakdown}
        isPending={false}
        labelOf={labelOf}
        emptyMessage="Nenhuma venda concluída no período."
      />
    )

    // Assert
    expect(
      screen.getByRole('img', { name: 'Faturamento por canal' })
    ).toBeInTheDocument()
    expect(screen.getByText('Entrega')).toBeInTheDocument()
  })

  it('does not show the empty state while pending', () => {
    // Arrange / Act
    render(
      <SalesTrendByDimension
        title="Faturamento por canal"
        breakdown={undefined}
        isPending
        labelOf={labelOf}
        emptyMessage="Nenhuma venda concluída no período."
      />
    )

    // Assert
    expect(
      screen.queryByText('Nenhuma venda concluída no período.')
    ).not.toBeInTheDocument()
  })
})

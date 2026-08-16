import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SalesBreakdown } from '@compositions/SalesBreakdown/SalesBreakdown'

describe(SalesBreakdown.name, () => {
  it('lists each item with its display value', () => {
    // Arrange / Act
    render(
      <SalesBreakdown
        title="Por canal"
        isPending={false}
        emptyMessage="Nenhuma venda concluída no período."
        items={[
          {
            id: 'DELIVERY',
            label: 'Entrega',
            value: 150,
            display: 'R$ 150,00',
          },
          { id: 'COUNTER', label: 'Balcão', value: 100, display: 'R$ 100,00' },
        ]}
      />
    )

    // Assert
    expect(screen.getByText('Entrega')).toBeInTheDocument()
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument()
    expect(screen.getByText('Balcão')).toBeInTheDocument()
  })

  it('shows the empty message when there are no items', () => {
    // Arrange / Act
    render(
      <SalesBreakdown
        title="Por canal"
        isPending={false}
        emptyMessage="Nenhuma venda concluída no período."
        items={[]}
      />
    )

    // Assert
    expect(
      screen.getByText('Nenhuma venda concluída no período.')
    ).toBeInTheDocument()
  })

  it('does not show the empty message while pending', () => {
    // Arrange / Act
    render(
      <SalesBreakdown
        title="Por canal"
        isPending
        emptyMessage="Nenhuma venda concluída no período."
        items={[]}
      />
    )

    // Assert
    expect(
      screen.queryByText('Nenhuma venda concluída no período.')
    ).not.toBeInTheDocument()
  })
})

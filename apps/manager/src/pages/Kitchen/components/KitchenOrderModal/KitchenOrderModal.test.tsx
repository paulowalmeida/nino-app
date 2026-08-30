import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { KitchenOrderModal } from './KitchenOrderModal'
import {
  kitchenOrderModalOrderMock,
  kitchenOrderModalSalesFormatsMock,
} from './KitchenOrderModal.mock'

describe(KitchenOrderModal.name, () => {
  it('shows the customer, items and notes for the selected order', () => {
    // Arrange / Act
    render(
      <KitchenOrderModal
        order={kitchenOrderModalOrderMock}
        salesFormats={kitchenOrderModalSalesFormatsMock}
        onOpenChange={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByText('Pedido #1234')).toBeInTheDocument()
    expect(screen.getByText('Mesa 7')).toBeInTheDocument()
    expect(screen.getByText('Cliente teste')).toBeInTheDocument()
    expect(screen.getByText('2× X-Tudo')).toBeInTheDocument()
    expect(screen.getByText('Sem cebola')).toBeInTheDocument()
  })

  it('renders nothing selectable when no order is open', () => {
    // Arrange / Act
    render(
      <KitchenOrderModal
        order={null}
        salesFormats={kitchenOrderModalSalesFormatsMock}
        onOpenChange={vi.fn()}
      />
    )

    // Assert
    expect(screen.queryByText('Cliente teste')).not.toBeInTheDocument()
  })
})

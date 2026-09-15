import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderTicket } from './OrderTicket'
import { orderTicketMock } from './OrderTicket.mock'

describe(OrderTicket.name, () => {
  it('shows the order number, customer and available action', () => {
    render(
      <MemoryRouter>
        <OrderTicket order={orderTicketMock} onAdvance={vi.fn()} />
      </MemoryRouter>
    )
    expect(screen.getByText('#42')).toBeInTheDocument()
    expect(screen.getByText('Cliente balcão')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { OrderTicket } from '@compositions/OrderTicket/OrderTicket'

import { pendingOrder } from './OrderTicket.mock'

const useElapsed = vi.hoisted(() => vi.fn())

vi.mock('@hooks/order/useElapsed', () => ({ useElapsed }))

const renderTicket = (
  props: Partial<React.ComponentProps<typeof OrderTicket>>
) =>
  render(
    <MemoryRouter>
      <OrderTicket order={pendingOrder} onAdvance={vi.fn()} {...props} />
    </MemoryRouter>
  )

describe(OrderTicket.name, () => {
  beforeEach(() => {
    useElapsed.mockReturnValue({ label: '2 min', isLate: false })
  })

  it('shows the customer, status and next step for an open order', () => {
    // Arrange / Act
    renderTicket({})

    // Assert
    expect(screen.getByText('Weskley Almeida')).toBeInTheDocument()
    expect(screen.getByText('esperando aceite')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Confirmar pedido' })
    ).toBeInTheDocument()
  })

  it('caps the visible items and counts the rest', () => {
    // Arrange / Act
    renderTicket({})

    // Assert
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getByText('e mais 1 item')).toBeInTheDocument()
  })

  it('links to the order detail route', () => {
    // Arrange / Act
    renderTicket({})

    // Assert
    expect(
      screen.getByRole('link', { name: /Abrir pedido/ })
    ).toHaveAttribute('href', `/${pendingOrder.id}`)
  })

  it('advances the order to the next status on click', async () => {
    // Arrange
    const onAdvance = vi.fn()
    renderTicket({ onAdvance })

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Confirmar pedido' })
    )

    // Assert
    expect(onAdvance).toHaveBeenCalledWith(pendingOrder.id, 'ACCEPTED')
  })

  it('hides the timer and the action once the order is closed', () => {
    // Arrange / Act
    renderTicket({ order: { ...pendingOrder, status: 'COMPLETED' } })

    // Assert
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByText('2 min')).not.toBeInTheDocument()
  })
})

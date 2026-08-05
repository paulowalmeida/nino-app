import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrderTimeline } from '@compositions/OrderTimeline/OrderTimeline'
import type { OrderStatusEntry } from '@custom_types/order/order-status-entry'
const acceptedFirst: OrderStatusEntry = {
  id: 'entry-1',
  status: 'ACCEPTED',
  changedByRealm: 'OPERATIONAL',
  changedById: 'user-1',
  createdAt: '2026-08-04T10:00:00.000Z',
}

const preparingSecond: OrderStatusEntry = {
  id: 'entry-2',
  status: 'PREPARING',
  changedByRealm: 'OPERATIONAL',
  changedById: 'user-1',
  createdAt: '2026-08-04T10:05:00.000Z',
}

describe(OrderTimeline.name, () => {
  it('renders one entry per status change', () => {
    // Arrange / Act
    render(<OrderTimeline entries={[acceptedFirst, preparingSecond]} />)

    // Assert
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('confirmado')).toBeInTheDocument()
    expect(screen.getByText('na cozinha')).toBeInTheDocument()
  })

  it('sorts entries from oldest to newest regardless of input order', () => {
    // Arrange / Act
    render(<OrderTimeline entries={[preparingSecond, acceptedFirst]} />)

    // Assert
    const labels = screen
      .getAllByRole('listitem')
      .map((item) => item.textContent)
    expect(labels[0]).toContain('confirmado')
    expect(labels[1]).toContain('na cozinha')
  })

  it('shows who made each change', () => {
    // Arrange / Act
    render(
      <OrderTimeline
        entries={[{ ...acceptedFirst, changedByRealm: 'CUSTOMER' }]}
      />
    )

    // Assert
    expect(screen.getByText(/pelo cliente/)).toBeInTheDocument()
  })

  it('renders an empty list with no entries', () => {
    // Arrange / Act
    const { container } = render(<OrderTimeline entries={[]} />)

    // Assert
    expect(container.querySelectorAll('li')).toHaveLength(0)
  })
})

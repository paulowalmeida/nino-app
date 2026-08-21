import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { KitchenCard } from '@organisms/KitchenCard/KitchenCard'

import { pendingOrder } from './KitchenCard.mock'

const useElapsed = vi.hoisted(() => vi.fn())

vi.mock('@hooks/order/useElapsed', () => ({ useElapsed }))

describe(KitchenCard.name, () => {
  beforeEach(() => {
    useElapsed.mockReturnValue({ label: '2 min', isLate: false, ratio: 0.2 })
  })

  it('shows the ticket number, customer and next step', () => {
    // Arrange / Act
    render(
      <KitchenCard order={pendingOrder} onAdvance={vi.fn()} isBusy={false} />
    )

    // Assert
    expect(screen.getByText('Weskley Almeida')).toBeInTheDocument()
    expect(screen.getByText('2 min')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Confirmar pedido' })
    ).toBeInTheDocument()
  })

  it('advances the order to the next status on click', async () => {
    // Arrange
    const onAdvance = vi.fn()
    render(
      <KitchenCard order={pendingOrder} onAdvance={onAdvance} isBusy={false} />
    )

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Confirmar pedido' })
    )

    // Assert
    expect(onAdvance).toHaveBeenCalledWith(pendingOrder.id, 'ACCEPTED')
  })

  it('hides the action once the order has no next step', () => {
    // Arrange / Act
    render(
      <KitchenCard
        order={{ ...pendingOrder, status: 'CANCELLED' }}
        onAdvance={vi.fn()}
        isBusy={false}
      />
    )

    // Assert
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('marks the ticket as late when the timer says so', () => {
    // Arrange
    useElapsed.mockReturnValue({ label: '40 min', isLate: true, ratio: 1 })

    // Act
    render(
      <KitchenCard order={pendingOrder} onAdvance={vi.fn()} isBusy={false} />
    )

    // Assert
    expect(screen.getByText('Pedido atrasado')).toBeInTheDocument()
  })

  it('does not announce lateness while the ticket is on time', () => {
    // Arrange
    useElapsed.mockReturnValue({ label: '4 min', isLate: false, ratio: 0.2 })

    // Act
    render(
      <KitchenCard order={pendingOrder} onAdvance={vi.fn()} isBusy={false} />
    )

    // Assert
    expect(screen.queryByText('Pedido atrasado')).not.toBeInTheDocument()
  })
})

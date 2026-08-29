import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { KitchenCard } from './KitchenCard'
import { kitchenCardOrderMock, tableDestinationMock } from './KitchenCard.mock'

vi.mock('@shared/hooks/order/useElapsed/useElapsed', () => ({
  useElapsed: () => ({
    label: '5 min',
    remaining: '15 min',
    isLate: false,
    pace: 'fresh',
    ratio: 0.25,
    overdueRatio: 0,
  }),
}))

describe(KitchenCard.name, () => {
  it('renders order details and advances it from the card action', () => {
    const onStep = vi.fn()
    render(
      <KitchenCard
        order={kitchenCardOrderMock}
        destination={tableDestinationMock}
        onStep={onStep}
        isBusy={false}
      />
    )

    expect(screen.getByText('Cliente teste')).toBeInTheDocument()
    expect(screen.getByText('Sem cebola')).toBeInTheDocument()
    expect(screen.getByText('X-Tudo')).toBeInTheDocument()
    expect(screen.getByText('Mesa 7')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    expect(onStep).toHaveBeenCalledWith('order-1234', 'ACCEPTED')
  })

  it('omits the destination label when the store has one format', () => {
    // Arrange
    render(
      <KitchenCard
        order={kitchenCardOrderMock}
        destination={null}
        onStep={vi.fn()}
        isBusy={false}
      />
    )

    // Assert
    expect(screen.queryByText('Mesa 7')).not.toBeInTheDocument()
    expect(screen.getByText('Cliente teste')).toBeInTheDocument()
  })

  it('summarizes the items when the wall is compacted', () => {
    // Arrange
    render(
      <KitchenCard
        order={kitchenCardOrderMock}
        destination={tableDestinationMock}
        onStep={vi.fn()}
        isBusy={false}
        isCompact
      />
    )

    // Assert
    expect(screen.getByText('2 itens')).toBeInTheDocument()
    expect(screen.queryByText('X-Tudo')).not.toBeInTheDocument()
    expect(screen.queryByText('Sem cebola')).not.toBeInTheDocument()
  })

  it('hides the action when the owner does not provide a transition', () => {
    render(
      <KitchenCard
        order={kitchenCardOrderMock}
        destination={tableDestinationMock}
        isBusy={false}
      />
    )

    expect(
      screen.queryByRole('button', { name: 'Confirmar pedido' })
    ).not.toBeInTheDocument()
  })

  it('identifies the cook through an avatar with an accessible name', () => {
    render(
      <KitchenCard
        order={kitchenCardOrderMock}
        destination={tableDestinationMock}
        isBusy={false}
        cookName="Marina Silva"
      />
    )

    expect(
      screen.getByLabelText('Em preparo com Marina Silva')
    ).toBeInTheDocument()
    expect(screen.getByText('MS')).toBeInTheDocument()
  })

  it('assigns and removes the cook from the avatar menu', async () => {
    const onCookChange = vi.fn()
    const user = userEvent.setup()
    render(
      <KitchenCard
        order={kitchenCardOrderMock}
        destination={tableDestinationMock}
        isBusy={false}
        cookName="Marina Silva"
        staff={[
          { role: 'STAFF', user: { id: 'staff-1', name: 'Marina Silva' } },
        ]}
        onCookChange={onCookChange}
      />
    )

    await user.click(
      screen.getByRole('button', { name: 'Alterar chapista: Marina Silva' })
    )
    await user.click(
      await screen.findByRole('menuitem', { name: 'Remover responsável' })
    )

    expect(onCookChange).toHaveBeenCalledWith(null)
  })
})

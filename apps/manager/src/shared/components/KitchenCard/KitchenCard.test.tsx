import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { KitchenCard } from './KitchenCard'
import { kitchenCardOrderMock } from './KitchenCard.mock'

vi.mock('@shared/hooks/order/useElapsed/useElapsed', () => ({
  useElapsed: () => ({ label: '5 min', isLate: false, ratio: 0.25 }),
}))

describe(KitchenCard.name, () => {
  it('renders order details and advances it from the card action', () => {
    const onAdvance = vi.fn()
    render(
      <KitchenCard
        order={kitchenCardOrderMock}
        onAdvance={onAdvance}
        isBusy={false}
      />
    )

    expect(screen.getByText('Cliente teste')).toBeInTheDocument()
    expect(screen.getByText('Sem cebola')).toBeInTheDocument()
    expect(screen.getByText('X-Tudo')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    expect(onAdvance).toHaveBeenCalledWith('order-1234', 'ACCEPTED')
  })
})

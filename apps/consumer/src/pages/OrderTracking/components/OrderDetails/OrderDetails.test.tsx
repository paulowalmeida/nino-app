import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { OrderDetails } from './OrderDetails'
import { orderDetailsMock } from './OrderDetails.mock'

vi.mock('@pages/order-tracking/hooks/useStoreAddress/useStoreAddress', () => ({
  useStoreAddress: () => orderDetailsMock.storeAddress,
}))

describe('OrderDetails', () => {
  it('summarizes the order and reveals items, totals and delivery data', async () => {
    render(
      <OrderDetails
        details={orderDetailsMock.details}
        channel={orderDetailsMock.channel}
      />
    )

    expect(screen.getByText('Detalhes do pedido')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByText(/Pizza Calabresa/)).toBeInTheDocument()
    expect(screen.getByText('Borda de catupiry')).toBeInTheDocument()
    expect(
      screen.getByText('Dinheiro · troco para R$ 100,00', { exact: false })
    ).toBeInTheDocument()
    expect(screen.getByText(/Rua do Sol, 25/)).toBeInTheDocument()
  })

  it('shows the store address for pickup orders', async () => {
    render(<OrderDetails details={orderDetailsMock.details} channel="PICKUP" />)
    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByText(orderDetailsMock.storeAddress)).toBeInTheDocument()
  })
})

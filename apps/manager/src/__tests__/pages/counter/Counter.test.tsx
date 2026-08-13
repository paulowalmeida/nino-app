import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useMenu } from '@hooks/product/useMenu'
import { useAcceptedPayments } from '@hooks/settings/useAcceptedPayments'
import { useCreateOrder } from '@hooks/order/useCreateOrder'

import { Counter } from '@pages/counter/Counter'

import { currentTenant, sections } from './Counter.mock'

vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/product/useMenu')
vi.mock('@hooks/settings/useAcceptedPayments')
vi.mock('@hooks/order/useCreateOrder')

const renderCounter = () => {
  vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
  vi.mocked(useMenu).mockReturnValue({
    sections,
    isPending: false,
  } as unknown as ReturnType<typeof useMenu>)
  vi.mocked(useAcceptedPayments).mockReturnValue({
    methods: ['CASH'],
  } as unknown as ReturnType<typeof useAcceptedPayments>)
  vi.mocked(useCreateOrder).mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useCreateOrder>)

  return render(<Counter />)
}

const pickItem = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: /X-Salada/ }))

describe(Counter.name, () => {
  it('keeps the coupon away while the sale has no items', () => {
    // Arrange / Act
    renderCounter()

    // Assert
    expect(screen.queryByText('1 item')).not.toBeInTheDocument()
  })

  it('shows the coupon with count and total once picked', async () => {
    // Arrange
    const user = userEvent.setup()
    renderCounter()

    // Act
    await pickItem(user)

    // Assert
    const coupon = screen.getByRole('button', { name: /1 item/ })
    expect(within(coupon).getByText('R$ 18,00')).toBeInTheDocument()
  })

  it('closes the sale sheet when the last item leaves the order', async () => {
    // Arrange
    const user = userEvent.setup()
    renderCounter()
    await pickItem(user)
    await user.click(screen.getByRole('button', { name: /1 item/ }))
    await screen.findByText('Comanda')

    // Act
    await user.click(
      screen.getByRole('button', { name: 'Tirar X-Salada da comanda' })
    )

    // Assert
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
    expect(screen.queryByText('1 item')).not.toBeInTheDocument()
  })

  it('drops name and table along with the lines when clearing', async () => {
    // Arrange
    const user = userEvent.setup()
    renderCounter()
    await pickItem(user)
    await user.click(screen.getByRole('button', { name: /1 item/ }))
    await screen.findByText('Comanda')
    await user.type(screen.getByPlaceholderText('Nome de quem pediu'), 'Ana')

    // Act
    await user.click(screen.getByRole('button', { name: 'Limpar comanda' }))
    await user.click(screen.getByRole('button', { name: 'Limpar' }))

    // Assert
    await waitFor(() =>
      expect(screen.queryByText('1 item')).not.toBeInTheDocument()
    )
    await pickItem(user)
    await user.click(screen.getByRole('button', { name: /1 item/ }))
    const name = await screen.findByPlaceholderText('Nome de quem pediu')
    expect(name).toHaveValue('')
  })
})

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useOrders } from '@hooks/order/useOrders'
import { useOrderStatus } from '@hooks/order/useOrderStatus'
import { useQueueSummary } from '@hooks/order/useQueueSummary'

import { Orders } from '@pages/orders/Orders'

import { closedOrder, currentTenant } from './Orders.mock'

vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/order/useOrders')
vi.mock('@hooks/order/useOrderStatus')
vi.mock('@hooks/order/useQueueSummary')

const renderOrders = (initialEntry = '/pedidos?etapa=closed') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Orders />
    </MemoryRouter>
  )

describe(Orders.name, () => {
  it('loads the next page by scrolling near the end, with no button', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useOrderStatus).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      variables: undefined,
    } as unknown as ReturnType<typeof useOrderStatus>)
    vi.mocked(useQueueSummary).mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useQueueSummary>)
    vi.mocked(useOrders).mockReturnValue({
      orders: [closedOrder],
      isPending: false,
      isError: false,
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
    } as unknown as ReturnType<typeof useOrders>)

    // Act
    renderOrders()

    // Assert
    expect(screen.queryByRole('button', { name: /carregar/i })).toBeNull()
  })

  it('shows a loading line at the end while the next page fetches', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useOrderStatus).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      variables: undefined,
    } as unknown as ReturnType<typeof useOrderStatus>)
    vi.mocked(useQueueSummary).mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useQueueSummary>)
    vi.mocked(useOrders).mockReturnValue({
      orders: [closedOrder],
      isPending: false,
      isError: false,
      hasNextPage: true,
      isFetchingNextPage: true,
      fetchNextPage: vi.fn(),
    } as unknown as ReturnType<typeof useOrders>)

    // Act
    renderOrders()

    // Assert
    expect(screen.getByText('Carregando mais…')).toBeInTheDocument()
  })
})

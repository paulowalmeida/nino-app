import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOrdersFacade } from '@pages/Orders/facades/useOrdersFacade/useOrdersFacade'
import { useLoadMore } from '@shared/hooks/ui/useLoadMore/useLoadMore'

import { OrdersQueue } from './OrdersQueue'
import { ordersQueueMock } from './OrdersQueue.mock'

vi.mock('@pages/Orders/facades/useOrdersFacade/useOrdersFacade')
vi.mock('@shared/hooks/ui/useLoadMore/useLoadMore', () => ({ useLoadMore: vi.fn(() => null) }))
vi.mock('@shared/components/OrderTicket/OrderTicket', () => ({
  OrderTicket: ({ onAdvance }: { onAdvance: (id: string, status: string) => void }) => (
    <button onClick={() => onAdvance('order-1', 'ACCEPTED')}>ticket</button>
  ),
}))
vi.mock('@pages/Orders/skeletons/OrderTicketSkeleton/OrderTicketSkeleton', () => ({
  OrderTicketSkeleton: () => <div>ticket loading</div>,
}))

describe('OrdersQueue', () => {
  it('renders an empty search state', () => {
    vi.mocked(useOrdersFacade).mockReturnValue({
      orders: [],
      isPending: false,
      isError: false,
      isSearching: true,
      search: 'pastel',
      stage: 'incoming',
      hasNextPage: false,
    } as never)

    render(<OrdersQueue />, { wrapper: MemoryRouter })

    expect(screen.getByText(ordersQueueMock.emptySearch)).toBeInTheDocument()
  })

  it('renders an API error state', () => {
    vi.mocked(useOrdersFacade).mockReturnValue({
      orders: [],
      isPending: false,
      isError: true,
      isSearching: false,
      stage: 'incoming',
    } as never)

    render(<OrdersQueue />, { wrapper: MemoryRouter })

    expect(screen.getByText(/Não foi possível carregar/)).toBeInTheDocument()
  })

  it('renders the current stage empty state', () => {
    vi.mocked(useOrdersFacade).mockReturnValue({
      orders: [],
      isPending: false,
      isError: false,
      isSearching: false,
      search: '',
      stage: 'closed',
      hasNextPage: false,
    } as never)

    render(<OrdersQueue />, { wrapper: MemoryRouter })

    expect(screen.getByText('Os pedidos concluídos aparecem aqui.')).toBeInTheDocument()
  })

  it('keeps an empty state safe for an unknown stage', () => {
    vi.mocked(useOrdersFacade).mockReturnValue({
      orders: [],
      isPending: false,
      isError: false,
      isSearching: false,
      search: '',
      stage: 'unknown',
      hasNextPage: false,
    } as never)

    render(<OrdersQueue />, { wrapper: MemoryRouter })

    expect(document.body.textContent).toBe('')
  })

  it('renders tickets and exposes pagination loading', () => {
    const advanceOrder = vi.fn()
    const fetchNextPage = vi.fn()
    vi.mocked(useOrdersFacade).mockReturnValue({
      orders: [{ id: 'order-1' }],
      isPending: false,
      isError: false,
      isSearching: true,
      search: 'pastel',
      stage: 'incoming',
      hasNextPage: true,
      isFetchingNextPage: true,
      fetchNextPage,
      advanceOrder,
      isAdvancing: true,
      advancingOrderId: 'order-1',
    } as never)

    render(<OrdersQueue />, { wrapper: MemoryRouter })

    screen.getByRole('button', { name: 'ticket' }).click()
    expect(advanceOrder).toHaveBeenCalledWith({
      orderId: 'order-1',
      status: 'ACCEPTED',
    })
    expect(screen.getByText('Carregando mais…')).toBeInTheDocument()

    const [, loadMoreCallback] = vi.mocked(useLoadMore).mock.calls.at(-1) ?? []
    loadMoreCallback?.()
    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('renders the loading tickets', () => {
    vi.mocked(useOrdersFacade).mockReturnValue({
      orders: [], isPending: true, isError: false,
      isSearching: false, stage: 'incoming',
    } as never)

    render(<OrdersQueue />, { wrapper: MemoryRouter })

    expect(screen.getAllByText('ticket loading')).toHaveLength(4)
  })
})

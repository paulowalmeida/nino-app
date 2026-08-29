import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'

import { OrderDetail } from './OrderDetail'
import { orderDetailPageMock } from './OrderDetail.mock'

vi.mock('@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade')
vi.mock(
  '@pages/OrderDetail/components/OrderDetailAside/OrderDetailAside',
  () => ({
    OrderDetailAside: () => <aside>aside</aside>,
  })
)
vi.mock(
  '@pages/OrderDetail/skeletons/OrderDetailSkeleton/OrderDetailSkeleton',
  () => ({
    OrderDetailSkeleton: () => <div>loading order</div>,
  })
)
vi.mock('@pages/OrderDetail/hooks/useBackTarget/useBackTarget', () => ({
  useBackTarget: () => ({ to: '..', label: orderDetailPageMock.backLabel }),
}))

const order = {
  id: 'order-1',
  orderNumber: 1042,
  channel: 'DELIVERY',
  status: 'PENDING',
  createdAt: '2026-01-01T10:00:00.000Z',
  items: [
    {
      id: 'item-1',
      quantity: 2,
      unitPrice: '3.5',
      product: { name: 'Pastel' },
    },
  ],
  subtotal: '20',
  deliveryFee: '0',
  totalAmount: '20',
}

const deliveredOrder = {
  ...order,
  deliveryFee: '7.5',
  deliveryZoneName: 'Centro',
  notes: 'Sem cebola',
  totalAmount: '27.5',
}

describe('OrderDetail', () => {
  it('renders the order content and its aside', () => {
    vi.mocked(useOrderDetailFacade).mockReturnValue({
      order,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useOrderDetailFacade>)

    render(<OrderDetail />, { wrapper: MemoryRouter })

    expect(
      screen.getByRole('heading', { name: orderDetailPageMock.title })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: orderDetailPageMock.backLabel })
    ).toBeInTheDocument()
    expect(screen.getByText('aside')).toBeInTheDocument()
    expect(screen.getByText('Pastel')).toBeInTheDocument()
  })

  it('announces loading and API failure separately', () => {
    vi.mocked(useOrderDetailFacade).mockReturnValue({
      order: undefined,
      isPending: true,
      isError: false,
    } as unknown as ReturnType<typeof useOrderDetailFacade>)
    const loading = render(<OrderDetail />, { wrapper: MemoryRouter })
    expect(screen.getByText('loading order')).toBeInTheDocument()
    loading.unmount()

    vi.mocked(useOrderDetailFacade).mockReturnValue({
      order: undefined,
      isPending: false,
      isError: true,
    } as unknown as ReturnType<typeof useOrderDetailFacade>)
    render(<OrderDetail />, { wrapper: MemoryRouter })
    expect(screen.getByText(/Não foi possível carregar/)).toBeInTheDocument()
  })

  it('explains when the order no longer exists', () => {
    vi.mocked(useOrderDetailFacade).mockReturnValue({
      order: undefined,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useOrderDetailFacade>)

    render(<OrderDetail />, { wrapper: MemoryRouter })

    expect(screen.getByText(/não está mais nesta loja/)).toBeInTheDocument()
  })

  it('charges the delivery zone and repeats what the customer asked', () => {
    vi.mocked(useOrderDetailFacade).mockReturnValue({
      order: deliveredOrder,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useOrderDetailFacade>)

    render(<OrderDetail />, { wrapper: MemoryRouter })

    expect(screen.getByText('Centro', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Observação do cliente')).toBeInTheDocument()
    expect(screen.getByText(/Sem cebola/)).toBeInTheDocument()
  })
})

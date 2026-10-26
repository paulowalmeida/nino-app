import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrdersFacade } from '@pages/Orders/facades/useOrdersFacade/useOrdersFacade'

import { OrdersHeader } from './OrdersHeader'
import { ordersHeaderMock } from './OrdersHeader.mock'

vi.mock('@pages/Orders/facades/useOrdersFacade/useOrdersFacade')

describe('OrdersHeader', () => {
  beforeEach(() => {
    vi.mocked(useOrdersFacade).mockReturnValue({
      isPagePending: false,
    } as never)
  })

  it('names the orders screen', () => {
    render(<OrdersHeader />)
    expect(
      screen.getByRole('heading', { name: ordersHeaderMock.title })
    ).toBeInTheDocument()
  })

  it('keeps the page title as a skeleton while data is pending', () => {
    vi.mocked(useOrdersFacade).mockReturnValue({ isPagePending: true } as never)

    render(<OrdersHeader />)

    expect(screen.getByRole('status')).toHaveTextContent('Carregando pedidos')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})

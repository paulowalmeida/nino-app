import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'

import { QueueBoard } from './QueueBoard'
import { queueBoardMock } from './QueueBoard.mock'

vi.mock('@pages/Overview/facades/useOverviewFacade/useOverviewFacade')

describe('QueueBoard', () => {
  it('renders the loading queue board', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      queueSummary: { data: undefined, isPending: true },
    } as never)

    render(<QueueBoard />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText('Fila de pedidos')).toBeInTheDocument()
    expect(queueBoardMock.tenantId).toBeTruthy()
  })

  it('renders idle and active queue tiles', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      queueSummary: {
        data: {
          PENDING: 1,
          ACCEPTED: 2,
          PREPARING: 0,
          OUT_FOR_DELIVERY: 0,
          READY_FOR_PICKUP: 0,
        },
        isPending: false,
      },
    } as never)

    render(<QueueBoard />, { wrapper: MemoryRouter })

    expect(screen.getByRole('link', { name: /Ver pedidos esperando aceite/ })).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.queryByText(/Nenhum pedido na fila/)).not.toBeInTheDocument()
  })

  it('renders the idle queue message', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      queueSummary: {
        data: {
          PENDING: 0,
          ACCEPTED: 0,
          PREPARING: 0,
          OUT_FOR_DELIVERY: 0,
          READY_FOR_PICKUP: 0,
        },
        isPending: false,
      },
    } as never)

    render(<QueueBoard />, { wrapper: MemoryRouter })

    expect(screen.getByText(/Nenhum pedido na fila/)).toBeInTheDocument()
  })
})

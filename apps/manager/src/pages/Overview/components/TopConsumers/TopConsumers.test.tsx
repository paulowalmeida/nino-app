import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'

import { TopConsumers } from './TopConsumers'
import { topConsumersMock } from './TopConsumers.mock'

vi.mock('@pages/Overview/facades/useOverviewFacade/useOverviewFacade')

describe('TopConsumers', () => {
  it('renders both consumer ranking regions', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      topConsumersSpent: { topConsumers: [], isPending: true },
      topConsumersOrders: { topConsumers: [], isPending: true },
    } as never)

    render(<TopConsumers />)

    expect(screen.getByLabelText(topConsumersMock.label)).toBeInTheDocument()
    expect(screen.getByLabelText('Quem mais pede')).toBeInTheDocument()
  })

  it('renders empty and populated rankings', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      topConsumersSpent: { topConsumers: [], isPending: false },
      topConsumersOrders: {
        topConsumers: [{ id: 'consumer-1', name: 'Ana', spent: 25, orders: 2 }],
        isPending: false,
      },
    } as never)

    render(<TopConsumers />)

    expect(
      screen.getAllByText('Nenhum cliente identificado ainda.')
    ).toHaveLength(1)
    expect(screen.getByText('Ana')).toBeInTheDocument()
  })

  it('maps consumers ranked by spending', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      topConsumersSpent: {
        topConsumers: [{ id: 'consumer-2', name: 'Bia', spent: 50, orders: 3 }],
        isPending: false,
      },
      topConsumersOrders: { topConsumers: [], isPending: false },
    } as never)

    render(<TopConsumers />)

    expect(screen.getByText('Bia')).toBeInTheDocument()
    expect(screen.getByText('R$ 50,00')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'

import { TopCustomers } from './TopCustomers'
import { topCustomersMock } from './TopCustomers.mock'

vi.mock('@pages/Overview/facades/useOverviewFacade/useOverviewFacade')

describe('TopCustomers', () => {
  it('renders both customer ranking regions', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      topCustomersSpent: { topCustomers: [], isPending: true },
      topCustomersOrders: { topCustomers: [], isPending: true },
    } as never)

    render(<TopCustomers />)

    expect(screen.getByLabelText(topCustomersMock.label)).toBeInTheDocument()
    expect(screen.getByLabelText('Quem mais pede')).toBeInTheDocument()
  })

  it('renders empty and populated rankings', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      topCustomersSpent: { topCustomers: [], isPending: false },
      topCustomersOrders: {
        topCustomers: [{ id: 'customer-1', name: 'Ana', spent: 25, orders: 2 }],
        isPending: false,
      },
    } as never)

    render(<TopCustomers />)

    expect(screen.getAllByText('Nenhum cliente identificado ainda.')).toHaveLength(1)
    expect(screen.getByText('Ana')).toBeInTheDocument()
  })

  it('maps customers ranked by spending', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      topCustomersSpent: {
        topCustomers: [{ id: 'customer-2', name: 'Bia', spent: 50, orders: 3 }],
        isPending: false,
      },
      topCustomersOrders: { topCustomers: [], isPending: false },
    } as never)

    render(<TopCustomers />)

    expect(screen.getByText('Bia')).toBeInTheDocument()
    expect(screen.getByText('R$ 50,00')).toBeInTheDocument()
  })
})

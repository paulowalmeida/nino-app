import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCustomersFacade } from '@pages/Customers/facades/useCustomersFacade/useCustomersFacade'

import { Customers } from './Customers'
import { customersPageMock } from './Customers.mock'

vi.mock('@pages/Customers/facades/useCustomersFacade/useCustomersFacade')
vi.mock('@pages/Customers/components/CustomersHeader/CustomersHeader', () => ({
  CustomersHeader: () => <div>header</div>,
}))
vi.mock('@pages/Customers/components/CustomersList/CustomersList', () => ({
  CustomersList: () => <div>list</div>,
}))
vi.mock(
  '@pages/Customers/skeletons/CustomersListSkeleton/CustomersListSkeleton',
  () => ({ CustomersListSkeleton: () => <div>loading</div> })
)

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useCustomersFacade).mockReturnValue({
    rows: [{ id: 'customer-1' }],
    search: '',
    isPending: false,
    isError: false,
    ...overrides,
  } as unknown as ReturnType<typeof useCustomersFacade>)

describe('Customers', () => {
  beforeEach(() => vi.clearAllMocks())

  it('composes the header and the list of customers', () => {
    facadeWith({})

    render(<Customers />)

    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('list')).toBeInTheDocument()
    expect(screen.queryByText('loading')).not.toBeInTheDocument()
  })

  it('shows the skeleton while the first page is pending', () => {
    facadeWith({ rows: [], isPending: true })

    render(<Customers />)

    expect(screen.getByText('loading')).toBeInTheDocument()
    expect(screen.queryByText('list')).not.toBeInTheDocument()
  })

  it('reports a failed load without an empty state', () => {
    facadeWith({ rows: [], isError: true })

    render(<Customers />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      customersPageMock.errorMessage
    )
    expect(
      screen.queryByText(customersPageMock.emptyBaseMessage, { exact: false })
    ).not.toBeInTheDocument()
  })

  it('states an empty base and an empty search separately', () => {
    facadeWith({ rows: [] })

    const base = render(<Customers />)
    expect(
      screen.getByText(customersPageMock.emptyBaseMessage, { exact: false })
    ).toBeInTheDocument()
    base.unmount()

    facadeWith({ rows: [], search: customersPageMock.search })

    render(<Customers />)
    expect(screen.getByText(/Nenhum cliente com "ana"/)).toBeInTheDocument()
  })
})

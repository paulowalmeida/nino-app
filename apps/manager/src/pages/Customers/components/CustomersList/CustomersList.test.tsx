import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCustomersFacade } from '@pages/Customers/facades/useCustomersFacade/useCustomersFacade'

import { CustomersList } from './CustomersList'
import { customerRowsMock } from './CustomersList.mock'

vi.mock('@pages/Customers/facades/useCustomersFacade/useCustomersFacade')

const loadMoreCustomers = vi.fn()

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useCustomersFacade).mockReturnValue({
    rows: customerRowsMock,
    hasNextPage: false,
    loadMoreCustomers,
    ...overrides,
  } as unknown as ReturnType<typeof useCustomersFacade>)

const renderList = () =>
  render(
    <MemoryRouter>
      <CustomersList />
    </MemoryRouter>
  )

describe('CustomersList', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists every customer under the column ruler', () => {
    facadeWith({})

    renderList()

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Cliente desde')).toBeInTheDocument()
  })

  it('hides the load-more control on the last page', () => {
    facadeWith({})

    renderList()

    expect(
      screen.queryByRole('button', { name: 'Carregar mais' })
    ).not.toBeInTheDocument()
  })

  it('asks for the next page from the load-more control', async () => {
    facadeWith({ hasNextPage: true })

    renderList()
    await userEvent.click(screen.getByRole('button', { name: 'Carregar mais' }))

    expect(loadMoreCustomers).toHaveBeenCalledOnce()
  })
})

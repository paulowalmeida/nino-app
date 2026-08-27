import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCustomersFacade } from '@pages/Customers/facades/useCustomersFacade/useCustomersFacade'

import { CustomersHeader } from './CustomersHeader'
import { customersHeaderMock } from './CustomersHeader.mock'

vi.mock('@pages/Customers/facades/useCustomersFacade/useCustomersFacade')

const setSearch = vi.fn()

describe('CustomersHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCustomersFacade).mockReturnValue({
      total: customersHeaderMock.total,
      setSearch,
    } as unknown as ReturnType<typeof useCustomersFacade>)
  })

  it('titles the screen and counts the base', () => {
    render(<CustomersHeader />)

    expect(
      screen.getByRole('heading', { name: 'Quem já comprou e volta' })
    ).toBeInTheDocument()
    expect(screen.getByText(/42 pessoas com pedido/)).toBeInTheDocument()
  })

  it('commits the typed term once it settles', async () => {
    render(<CustomersHeader />)

    await userEvent.type(
      screen.getByRole('searchbox', { name: customersHeaderMock.searchLabel }),
      customersHeaderMock.term
    )

    await waitFor(() =>
      expect(setSearch).toHaveBeenLastCalledWith(customersHeaderMock.term)
    )
  })
})

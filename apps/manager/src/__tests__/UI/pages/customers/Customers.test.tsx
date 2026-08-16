import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Membership } from '@custom_types/auth/membership'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useCustomers } from '@hooks/customer/useCustomers'
import { Customers } from '@pages/customers/Customers'

import { currentTenant, oneCustomer } from './Customers.mock'

vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/customer/useCustomers')

const renderCustomers = () => {
  vi.mocked(useCurrentTenant).mockReturnValue(
    currentTenant as unknown as Membership
  )

  return render(
    <MemoryRouter>
      <Customers />
    </MemoryRouter>
  )
}

describe(Customers.name, () => {
  beforeEach(() => {
    vi.mocked(useCustomers).mockReturnValue({
      customers: [oneCustomer],
      total: 1,
      isPending: false,
      isError: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    } as unknown as ReturnType<typeof useCustomers>)
  })

  it('shows the customer once loaded', () => {
    // Arrange / Act
    renderCustomers()

    // Assert
    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
  })

  it('types into the search field without losing the term', async () => {
    // Arrange
    renderCustomers()
    const search = screen.getByLabelText(
      'Buscar por nome, telefone ou e-mail'
    )

    // Act
    await userEvent.type(search, 'maria')

    // Assert
    expect(search).toHaveValue('maria')
  })

  it('names the search term in the empty state', () => {
    // Arrange
    vi.mocked(useCustomers).mockReturnValue({
      customers: [],
      total: 0,
      isPending: false,
      isError: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    } as unknown as ReturnType<typeof useCustomers>)

    // Act
    renderCustomers()

    // Assert
    expect(
      screen.getByText('Ninguém por aqui ainda. Quem fizer o primeiro ' +
        'pedido pelo app aparece nesta lista.')
    ).toBeInTheDocument()
  })
})

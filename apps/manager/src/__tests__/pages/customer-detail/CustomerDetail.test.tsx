import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Membership } from '@custom_types/auth/membership'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useCustomer } from '@hooks/customer/useCustomer'
import { useCustomerOrders } from '@hooks/customer/useCustomerOrders'
import { CustomerDetail } from '@pages/customer-detail/CustomerDetail'

import { currentTenant, customerHistory } from './CustomerDetail.mock'

vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/customer/useCustomer')
vi.mock('@hooks/customer/useCustomerOrders')

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={['/clientes/customer-1']}>
      <Routes>
        <Route path="/clientes/:customerId" element={<CustomerDetail />} />
      </Routes>
    </MemoryRouter>
  )

describe(CustomerDetail.name, () => {
  it('shows the customer summary once loaded', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(
      currentTenant as unknown as Membership
    )
    vi.mocked(useCustomer).mockReturnValue({
      data: customerHistory,
      isPending: false,
    } as unknown as ReturnType<typeof useCustomer>)
    vi.mocked(useCustomerOrders).mockReturnValue({
      orders: [],
      total: 0,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
    } as unknown as ReturnType<typeof useCustomerOrders>)

    // Act
    renderDetail()

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Ana Souza' })
    ).toBeInTheDocument()
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument()
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument()
    expect(screen.getByText(/Av\. Paulista, 1000/)).toBeInTheDocument()
    expect(screen.getByText('Principal')).toBeInTheDocument()
  })

  it('shows an empty note when the customer has no address', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(
      currentTenant as unknown as Membership
    )
    vi.mocked(useCustomer).mockReturnValue({
      data: { ...customerHistory, addresses: [] },
      isPending: false,
    } as unknown as ReturnType<typeof useCustomer>)
    vi.mocked(useCustomerOrders).mockReturnValue({
      orders: [],
      total: 0,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
    } as unknown as ReturnType<typeof useCustomerOrders>)

    // Act
    renderDetail()

    // Assert
    expect(
      screen.getByText('Nenhum endereço registrado ainda.')
    ).toBeInTheDocument()
  })

  it('shows the not-found state when the customer does not exist', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(
      currentTenant as unknown as Membership
    )
    vi.mocked(useCustomer).mockReturnValue({
      data: undefined,
      isPending: false,
    } as unknown as ReturnType<typeof useCustomer>)
    vi.mocked(useCustomerOrders).mockReturnValue({
      orders: [],
      total: 0,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
    } as unknown as ReturnType<typeof useCustomerOrders>)

    // Act
    renderDetail()

    // Assert
    expect(
      screen.getByText('Esta pessoa não tem pedido nesta loja.')
    ).toBeInTheDocument()
  })

  it('shows the empty state when the customer has no order here', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(
      currentTenant as unknown as Membership
    )
    vi.mocked(useCustomer).mockReturnValue({
      data: customerHistory,
      isPending: false,
    } as unknown as ReturnType<typeof useCustomer>)
    vi.mocked(useCustomerOrders).mockReturnValue({
      orders: [],
      total: 0,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
    } as unknown as ReturnType<typeof useCustomerOrders>)

    // Act
    renderDetail()

    // Assert
    expect(
      screen.getByText('Nenhum pedido nos últimos 90 dias.')
    ).toBeInTheDocument()
  })
})

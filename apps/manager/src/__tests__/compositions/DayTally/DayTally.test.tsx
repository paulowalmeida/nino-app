import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Order } from '@custom_types/order/order'
import { useOrders } from '@hooks/order/useOrders'
import { DayTally } from '@compositions/DayTally/DayTally'

import { baseOrder } from './DayTally.mock'

vi.mock('@hooks/order/useOrders')

const renderTally = () =>
  render(
    <MemoryRouter>
      <DayTally tenantId="tenant-1" timezone="America/Fortaleza" />
    </MemoryRouter>
  )

const buildOrder = (patch: Partial<Order>): Order => ({
  ...baseOrder,
  createdAt: new Date().toISOString(),
  ...patch,
})

const mockOrders = (orders: Order[]) =>
  vi.mocked(useOrders).mockReturnValue({
    orders,
    isPending: false,
  } as unknown as ReturnType<typeof useOrders>)

describe(DayTally.name, () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-04T12:00:00-03:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sums today paid orders into count, revenue and average', () => {
    // Arrange
    mockOrders([
      buildOrder({ id: 'order-0001', totalAmount: '10.00' }),
      buildOrder({ id: 'order-0002', totalAmount: '20.00' }),
    ])

    // Act
    renderTally()

    // Assert
    expect(
      screen.getByLabelText('Ver o relatório de faturamento de hoje')
    ).toHaveTextContent('R$ 30,00')
    expect(
      screen.getByLabelText('Ver o ticket médio de hoje no relatório')
    ).toHaveTextContent('R$ 15,00')
  })

  it('excludes cancelled orders from the tally', () => {
    // Arrange
    mockOrders([
      buildOrder({ id: 'order-0001', totalAmount: '10.00' }),
      buildOrder({
        id: 'order-0002',
        totalAmount: '90.00',
        status: 'CANCELLED',
      }),
    ])

    // Act
    renderTally()

    // Assert
    expect(
      screen.getByLabelText('Ver o relatório de faturamento de hoje')
    ).toHaveTextContent('R$ 10,00')
  })

  it('groups revenue by payment method into the bar list', () => {
    // Arrange
    mockOrders([
      buildOrder({
        id: 'order-0001',
        totalAmount: '10.00',
        paymentMethod: 'PIX_ONLINE',
      }),
      buildOrder({
        id: 'order-0002',
        totalAmount: '20.00',
        paymentMethod: 'CASH',
      }),
      buildOrder({
        id: 'order-0003',
        totalAmount: '5.00',
        paymentMethod: 'CASH',
      }),
    ])

    // Act
    renderTally()

    // Assert
    const paymentSection = screen
      .getByText('Por forma de pagamento')
      .closest('div')
    expect(paymentSection).toHaveTextContent('Dinheiro')
    expect(paymentSection).toHaveTextContent('R$ 25,00')
    expect(paymentSection).toHaveTextContent('Pix online')
    expect(paymentSection).toHaveTextContent('R$ 10,00')
  })

  it('hides the payment breakdown with no orders today', () => {
    // Arrange
    mockOrders([])

    // Act
    renderTally()

    // Assert
    expect(screen.queryByText('Por forma de pagamento')).toBeNull()
  })

  it('shows skeletons instead of the recent list while pending', () => {
    // Arrange
    vi.mocked(useOrders).mockReturnValue({
      orders: [],
      isPending: true,
    } as unknown as ReturnType<typeof useOrders>)

    // Act
    renderTally()

    // Assert
    expect(screen.getAllByRole('link')).toHaveLength(3)
  })

  it('renders nothing in the recent list with no orders today', () => {
    // Arrange
    mockOrders([])

    // Act
    renderTally()

    // Assert
    expect(screen.getAllByRole('link')).toHaveLength(3)
  })
})

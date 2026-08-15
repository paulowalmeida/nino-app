import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useTopCustomers } from '@hooks/customer/useTopCustomers'
import { TopCustomers } from '@compositions/TopCustomers/TopCustomers'

import { topFrequent, topSpenders } from './TopCustomers.mock'

vi.mock('@hooks/customer/useTopCustomers')

type Metric = Parameters<typeof useTopCustomers>[1]

const mockRanking = (
  bySpent: Partial<ReturnType<typeof useTopCustomers>>,
  byOrders: Partial<ReturnType<typeof useTopCustomers>>
) =>
  vi.mocked(useTopCustomers).mockImplementation((_tenantId, metric: Metric) =>
    ({
      topCustomers: [],
      isPending: false,
      ...(metric === 'spent' ? bySpent : byOrders),
    }) as unknown as ReturnType<typeof useTopCustomers>
  )

describe(TopCustomers.name, () => {
  it('shows five skeleton bars per card while both rankings load', () => {
    // Arrange
    mockRanking({ isPending: true }, { isPending: true })

    // Act
    const { container } = render(<TopCustomers tenantId="tenant-1" />)

    // Assert
    expect(container.querySelectorAll('[style*="width"]')).toHaveLength(10)
  })

  it('renders spenders and frequent buyers as separate cards', () => {
    // Arrange
    mockRanking({ topCustomers: topSpenders }, { topCustomers: topFrequent })

    // Act
    render(<TopCustomers tenantId="tenant-1" />)
    const spentCard = screen.getByRole('region', { name: 'Quem mais gasta' })
    const ordersCard = screen.getByRole('region', { name: 'Quem mais pede' })

    // Assert
    expect(within(spentCard).getByText('Ana')).toBeInTheDocument()
    expect(within(spentCard).getByText('R$ 420,00')).toBeInTheDocument()
    expect(within(ordersCard).getByText('Bruno')).toBeInTheDocument()
    expect(within(ordersCard).getByText('12')).toBeInTheDocument()
  })

  it('shows the empty state on each card with no orders in the period', () => {
    // Arrange
    mockRanking({ topCustomers: [] }, { topCustomers: [] })

    // Act
    render(<TopCustomers tenantId="tenant-1" />)

    // Assert
    expect(
      screen.getAllByText('Nenhum cliente identificado ainda.')
    ).toHaveLength(2)
  })
})

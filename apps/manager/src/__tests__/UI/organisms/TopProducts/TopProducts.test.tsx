import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSalesReport } from '@hooks/order/useSalesReport'
import { TopProducts } from '@organisms/TopProducts/TopProducts'

import {
  salesReportWithoutProducts,
  salesReportWithProducts,
} from './TopProducts.mock'

vi.mock('@hooks/order/useSalesReport')

const mockReport = (
  overrides: Partial<ReturnType<typeof useSalesReport>> = {}
) =>
  vi.mocked(useSalesReport).mockReturnValue({
    report: salesReportWithProducts,
    isPending: false,
    ...overrides,
  } as unknown as ReturnType<typeof useSalesReport>)

describe(TopProducts.name, () => {
  it('shows the five skeleton bars while the report is loading', () => {
    // Arrange
    mockReport({ isPending: true, report: undefined })

    // Act
    const { container } = render(<TopProducts tenantId="tenant-1" />)

    // Assert
    expect(container.querySelectorAll('[style*="width"]')).toHaveLength(5)
  })

  it('lists top products sorted by quantity once loaded', () => {
    // Arrange
    mockReport()

    // Act
    render(<TopProducts tenantId="tenant-1" />)

    // Assert
    expect(screen.getByText('Coxinha')).toBeInTheDocument()
    expect(screen.getByText('Refrigerante lata')).toBeInTheDocument()
  })

  it('shows the empty state when nothing sold in the period', () => {
    // Arrange
    mockReport({ report: salesReportWithoutProducts })

    // Act
    render(<TopProducts tenantId="tenant-1" />)

    // Assert
    expect(
      screen.getByText('Nenhuma venda concluída na semana.')
    ).toBeInTheDocument()
  })

  it('caps the list at five products even with more in the report', () => {
    // Arrange
    const manyProducts = {
      ...salesReportWithProducts,
      topProducts: Array.from({ length: 8 }, (_, index) => ({
        productId: `item-${index}`,
        name: `Produto ${index}`,
        quantity: 8 - index,
        unitPrice: 10,
        revenue: 10 * (8 - index),
      })),
    }
    mockReport({ report: manyProducts })

    // Act
    render(<TopProducts tenantId="tenant-1" />)

    // Assert
    expect(screen.getByText('Produto 0')).toBeInTheDocument()
    expect(screen.queryByText('Produto 5')).not.toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSalesSeries } from '@hooks/order/useSalesSeries'
import { SalesTrend } from '@compositions/SalesTrend/SalesTrend'

import { emptySeries, twoDaySeries } from './SalesTrend.mock'

vi.mock('@hooks/order/useSalesSeries')

describe(SalesTrend.name, () => {
  it('shows the empty state with no sales in the period', () => {
    // Arrange
    vi.mocked(useSalesSeries).mockReturnValue({
      series: emptySeries,
      isPending: false,
    } as unknown as ReturnType<typeof useSalesSeries>)

    // Act
    render(<SalesTrend tenantId="tenant-1" />)

    // Assert
    expect(
      screen.getByText('Nenhuma venda concluída nos últimos sete dias.')
    ).toBeInTheDocument()
  })

  it('shows the accumulated total for the week', () => {
    // Arrange
    vi.mocked(useSalesSeries).mockReturnValue({
      series: twoDaySeries,
      isPending: false,
    } as unknown as ReturnType<typeof useSalesSeries>)

    // Act
    render(<SalesTrend tenantId="tenant-1" />)

    // Assert
    expect(screen.getByText('R$ 300,00')).toBeInTheDocument()
  })

  it('does not show the empty state while pending', () => {
    // Arrange
    vi.mocked(useSalesSeries).mockReturnValue({
      series: undefined,
      isPending: true,
    } as unknown as ReturnType<typeof useSalesSeries>)

    // Act
    render(<SalesTrend tenantId="tenant-1" />)

    // Assert
    expect(
      screen.queryByText('Nenhuma venda concluída nos últimos sete dias.')
    ).not.toBeInTheDocument()
  })
})

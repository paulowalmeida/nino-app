import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSalesSeries } from '@hooks/order/useSalesSeries'
import {
  SalesPeriodTrend,
} from '@organisms/SalesPeriodTrend/SalesPeriodTrend'

import { emptySeries, twoDaySeries } from './SalesPeriodTrend.mock'

vi.mock('@hooks/order/useSalesSeries')

const renderTrend = () =>
  render(
    <SalesPeriodTrend tenantId="tenant-1" range={{ period: 'today' }} />
  )

describe(SalesPeriodTrend.name, () => {
  it('shows the empty state with no sales in the period', () => {
    // Arrange
    vi.mocked(useSalesSeries).mockReturnValue({
      series: emptySeries,
      isPending: false,
    } as unknown as ReturnType<typeof useSalesSeries>)

    // Act
    renderTrend()

    // Assert
    expect(
      screen.getByText('Nenhuma venda concluída no período.')
    ).toBeInTheDocument()
  })

  it('draws the chart when the period has sales', () => {
    // Arrange
    vi.mocked(useSalesSeries).mockReturnValue({
      series: twoDaySeries,
      isPending: false,
    } as unknown as ReturnType<typeof useSalesSeries>)

    // Act
    renderTrend()

    // Assert
    expect(
      screen.getByRole('img', { name: 'Faturamento por período no relatório' })
    ).toBeInTheDocument()
  })

  it('does not show the empty state while pending', () => {
    // Arrange
    vi.mocked(useSalesSeries).mockReturnValue({
      series: undefined,
      isPending: true,
    } as unknown as ReturnType<typeof useSalesSeries>)

    // Act
    renderTrend()

    // Assert
    expect(
      screen.queryByText('Nenhuma venda concluída no período.')
    ).not.toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  SalesFiguresGrid,
} from '@compositions/SalesFiguresGrid/SalesFiguresGrid'
import { brl } from '@utils/money'

import { fullPeriodReport } from './SalesFiguresGrid.mock'

const moneyText = (value: number): string =>
  brl(value).replace(/\u00a0/g, ' ')

describe(SalesFiguresGrid.name, () => {
  it('formats money and count figures once the report loads', () => {
    // Arrange / Act
    render(<SalesFiguresGrid report={fullPeriodReport} isPending={false} />)

    // Assert
    expect(
      screen.getByText(moneyText(fullPeriodReport.revenue))
    ).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(
      screen.getByText(moneyText(fullPeriodReport.averageTicket))
    ).toBeInTheDocument()
  })

  it('shows the labels without formatted values while pending', () => {
    // Arrange / Act
    render(<SalesFiguresGrid report={undefined} isPending />)

    // Assert
    expect(screen.getByText('Faturamento')).toBeInTheDocument()
    expect(screen.queryByText(moneyText(0))).not.toBeInTheDocument()
  })

  it('keeps showing skeletons when the report is still undefined', () => {
    // Arrange / Act
    render(<SalesFiguresGrid report={undefined} isPending={false} />)

    // Assert
    expect(screen.getByText('Ticket médio')).toBeInTheDocument()
    expect(screen.queryByText(moneyText(0))).not.toBeInTheDocument()
  })
})

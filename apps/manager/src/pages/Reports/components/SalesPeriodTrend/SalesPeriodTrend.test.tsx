import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SalesPeriodTrend } from './SalesPeriodTrend'

vi.mock('@shared/hooks/order/useSalesSeries/useSalesSeries', () => ({ useSalesSeries: () => ({ series: undefined, isPending: false }) }))

describe('SalesPeriodTrend', () => {
  it('shows the empty period state', () => {
    render(<SalesPeriodTrend unitId={null} range={{ period: 'today' }} />)
    expect(screen.getByText('Nenhuma venda concluída no período.')).toBeInTheDocument()
  })
})

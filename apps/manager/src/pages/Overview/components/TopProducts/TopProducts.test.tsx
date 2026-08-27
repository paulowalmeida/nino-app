import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'

import { TopProducts } from './TopProducts'
import { topProductsMock } from './TopProducts.mock'

vi.mock('@pages/Overview/facades/useOverviewFacade/useOverviewFacade')

describe('TopProducts', () => {
  it('renders the product ranking loading state', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      salesReport: { report: undefined, isPending: true },
    } as never)

    render(<TopProducts />)

    expect(screen.getByLabelText(topProductsMock.label)).toBeInTheDocument()
  })

  it('renders the empty product ranking', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      salesReport: { report: { topProducts: [] }, isPending: false },
    } as never)

    render(<TopProducts />)

    expect(screen.getByText('Nenhuma venda concluída na semana.')).toBeInTheDocument()
  })

  it('renders a populated product ranking', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      salesReport: {
        report: {
          topProducts: [{ productId: 'product-1', name: 'Pastel', quantity: 3, revenue: 30 }],
        },
        isPending: false,
      },
    } as never)

    render(<TopProducts />)

    expect(screen.getByText('Pastel')).toBeInTheDocument()
    expect(screen.getByText('3 un · R$ 30,00')).toBeInTheDocument()
  })
})

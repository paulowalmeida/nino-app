import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import { TabFinalizedSummary } from './TabFinalizedSummary'
import { tabFinalizedSummaryMock } from './TabFinalizedSummary.mock'

vi.mock(
  '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
)

const mockTab = (tab: unknown) =>
  vi.mocked(useTableTabDetailFacade).mockReturnValue({
    tab,
  } as unknown as ReturnType<typeof useTableTabDetailFacade>)

describe('TabFinalizedSummary', () => {
  it('states how the paid tab was settled, with change and moment', () => {
    mockTab(tabFinalizedSummaryMock.paidTab)

    render(<TabFinalizedSummary />)

    expect(
      screen.getByRole('heading', { name: 'Conta paga' })
    ).toBeInTheDocument()
    expect(screen.getByText('Dinheiro')).toBeInTheDocument()
    expect(screen.getByText('R$ 36,00')).toBeInTheDocument()
    expect(screen.getByText('Troco de R$ 14,00')).toBeInTheDocument()
    expect(screen.getByText('Pago em 19/10/2026, 10:10')).toBeInTheDocument()
    expect(
      screen.getByText('Comanda encerrada. Esta tela agora é só consulta.')
    ).toBeInTheDocument()
  })

  it('omits the change line when the payment was exact', () => {
    mockTab(tabFinalizedSummaryMock.exactPaymentTab)

    render(<TabFinalizedSummary />)

    expect(screen.queryByText(/Troco de/)).not.toBeInTheDocument()
  })

  it('states why a cancelled tab was closed', () => {
    mockTab(tabFinalizedSummaryMock.cancelledTab)

    render(<TabFinalizedSummary />)

    expect(
      screen.getByRole('heading', { name: 'Comanda cancelada' })
    ).toBeInTheDocument()
    expect(screen.getByText('Cliente saiu sem consumir')).toBeInTheDocument()
    expect(
      screen.getByText('Cancelada em 19/10/2026, 10:15')
    ).toBeInTheDocument()
    expect(screen.queryByText('Conta paga')).not.toBeInTheDocument()
  })

  it('renders nothing while the tab is unknown', () => {
    mockTab(undefined)

    const { container } = render(<TabFinalizedSummary />)

    expect(container).toBeEmptyDOMElement()
  })
})

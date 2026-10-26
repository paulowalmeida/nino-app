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
  it('states what the paid tab added up to', () => {
    mockTab(tabFinalizedSummaryMock.paidTab)

    render(<TabFinalizedSummary />)

    expect(
      screen.getByRole('heading', { name: 'Conta paga' })
    ).toBeInTheDocument()
    expect(screen.getByText('Total pago')).toBeInTheDocument()
    expect(
      screen.getByRole('list', { name: 'Pagamentos registrados' })
    ).toBeInTheDocument()
    expect(screen.queryByText(/Serviço/)).not.toBeInTheDocument()
    expect(
      screen.getByText('Comanda encerrada. Esta tela agora é só consulta.')
    ).toBeInTheDocument()
  })

  it('shows the service fee the customer paid', () => {
    mockTab(tabFinalizedSummaryMock.serviceFeeTab)

    render(<TabFinalizedSummary />)

    expect(screen.getByText('Serviço (10%)')).toBeInTheDocument()
    expect(screen.getByText('R$ 3,60')).toBeInTheDocument()
    expect(screen.getAllByText('R$ 39,60')).not.toHaveLength(0)
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

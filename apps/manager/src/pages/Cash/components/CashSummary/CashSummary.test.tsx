import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCashFacade } from '../../facades/useCashFacade/useCashFacade'
import { openSessionMock } from '../../hooks/useCashSession/useCashSession.mock'
import { CashSummary } from './CashSummary'
import { cashSummaryMock } from './CashSummary.mock'

vi.mock('../../facades/useCashFacade/useCashFacade')

const facadeWith = (session: unknown) =>
  vi.mocked(useCashFacade).mockReturnValue({
    session,
  } as unknown as ReturnType<typeof useCashFacade>)

describe(CashSummary.name, () => {
  beforeEach(() => facadeWith(cashSummaryMock.session))

  it('renders nothing while there is no session', () => {
    facadeWith(null)

    const { container } = render(<CashSummary />)

    expect(container).toBeEmptyDOMElement()
  })

  it('names who opened the drawer and when', () => {
    render(<CashSummary />)

    expect(screen.getByText(/Ana · desde/)).toBeInTheDocument()
  })

  it('breaks the drawer down into its four figures', () => {
    render(<CashSummary />)

    expect(screen.getByText('Fundo de troco')).toBeInTheDocument()
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 60,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 50,00')).toBeInTheDocument()
    expect(screen.getByText('−R$ 30,00')).toBeInTheDocument()
  })

  it('states what the drawer should hold right now', () => {
    render(<CashSummary />)

    expect(screen.getByText('Deve ter na gaveta')).toBeInTheDocument()
    expect(screen.getByText('R$ 180,00')).toBeInTheDocument()
  })

  it('names when a closed drawer was counted, and how it landed', () => {
    facadeWith({
      ...openSessionMock,
      closedAt: '2026-08-29T22:00:00.000Z',
      countedAmount: 178,
      difference: -2,
    })

    render(<CashSummary />)

    expect(screen.getByText('Caixa fechado')).toBeInTheDocument()
    expect(screen.getByText(/Fechado às/)).toBeInTheDocument()
    expect(screen.getByText('Devia ter na gaveta')).toBeInTheDocument()
    expect(screen.getByText('Contado no fechamento')).toBeInTheDocument()
    expect(screen.getByText('R$ 178,00')).toBeInTheDocument()
    expect(screen.getByText('Faltou R$ 2,00')).toBeInTheDocument()
  })

  it('shows an untouched drawer as its float alone', () => {
    facadeWith({
      ...openSessionMock,
      salesTotal: 0,
      depositsTotal: 0,
      withdrawalsTotal: 0,
      expectedAmount: 100,
      movements: [],
    })

    render(<CashSummary />)

    expect(screen.getAllByText('R$ 0,00')).toHaveLength(2)
  })
})

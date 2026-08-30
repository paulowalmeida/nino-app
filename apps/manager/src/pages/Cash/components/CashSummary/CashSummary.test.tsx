import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { openSessionMock } from '../../hooks/useCashSession/useCashSession.mock'
import { CashSummary } from './CashSummary'
import { cashSummaryMock } from './CashSummary.mock'

describe(CashSummary.name, () => {
  it('names who opened the drawer and when', () => {
    render(<CashSummary {...cashSummaryMock} />)

    expect(screen.getByText(/Ana · desde/)).toBeInTheDocument()
  })

  it('breaks the drawer down into its four figures', () => {
    render(<CashSummary {...cashSummaryMock} />)

    expect(screen.getByText('Fundo de troco')).toBeInTheDocument()
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 60,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 50,00')).toBeInTheDocument()
    expect(screen.getByText('−R$ 30,00')).toBeInTheDocument()
  })

  it('states what the drawer should hold right now', () => {
    render(<CashSummary {...cashSummaryMock} />)

    expect(screen.getByText('Deve ter na gaveta')).toBeInTheDocument()
    expect(screen.getByText('R$ 180,00')).toBeInTheDocument()
  })

  it('shows an untouched drawer as its float alone', () => {
    render(
      <CashSummary
        session={{
          ...openSessionMock,
          salesTotal: 0,
          depositsTotal: 0,
          withdrawalsTotal: 0,
          expectedAmount: 100,
          movements: [],
        }}
      />
    )

    expect(screen.getAllByText('R$ 0,00')).toHaveLength(2)
  })
})

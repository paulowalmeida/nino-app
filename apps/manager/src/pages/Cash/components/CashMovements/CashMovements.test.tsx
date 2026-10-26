import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { CashMovements } from './CashMovements'
import { cashMovementsMock, cashMovementsPagedMock } from './CashMovements.mock'

describe(CashMovements.name, () => {
  it('lists every movement of the session', () => {
    render(<CashMovements {...cashMovementsMock} />)

    expect(screen.getByText('Venda em dinheiro')).toBeInTheDocument()
    expect(screen.getByText('Sangria')).toBeInTheDocument()
  })

  it('signs money leaving the drawer apart from money coming in', () => {
    render(<CashMovements {...cashMovementsMock} />)

    expect(screen.getByText(/^\+/)).toHaveTextContent('+R$ 60,00')
    expect(screen.getByText(/^−/)).toHaveTextContent('−R$ 30,00')
  })

  it('shows the reason someone gave for a withdrawal', () => {
    render(<CashMovements {...cashMovementsMock} />)

    expect(screen.getByText(/Pagamento do gás/)).toBeInTheDocument()
  })

  it('says plainly when nothing moved yet', () => {
    render(<CashMovements movements={[]} />)

    expect(
      screen.getByText('Nada entrou nem saiu da gaveta desde a abertura.')
    ).toBeInTheDocument()
  })

  it('does not offer pages while everything fits on one', () => {
    render(<CashMovements {...cashMovementsMock} />)

    expect(
      screen.queryByRole('button', { name: 'Próxima página' })
    ).not.toBeInTheDocument()
  })

  it('shows the first page and reaches the rest through the pagination', async () => {
    render(<CashMovements {...cashMovementsPagedMock} />)

    expect(screen.getAllByRole('row')).toHaveLength(9)

    await userEvent.click(screen.getByRole('button', { name: 'Próxima página' }))

    expect(screen.getAllByRole('row')).toHaveLength(3)
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCashFacade } from '@pages/Cash/facades/useCashFacade/useCashFacade'

import { CashMovements } from './CashMovements'
import { cashMovementsMock, cashMovementsPagedMock } from './CashMovements.mock'

vi.mock('@pages/Cash/facades/useCashFacade/useCashFacade')

const facadeWith = (session: unknown) =>
  vi.mocked(useCashFacade).mockReturnValue({
    session,
  } as unknown as ReturnType<typeof useCashFacade>)

describe(CashMovements.name, () => {
  beforeEach(() => facadeWith(cashMovementsMock.session))

  it('renders nothing while there is no session', () => {
    facadeWith(null)

    const { container } = render(<CashMovements />)

    expect(container).toBeEmptyDOMElement()
  })

  it('lists every movement of the session', () => {
    render(<CashMovements />)

    expect(screen.getByText('Venda em dinheiro')).toBeInTheDocument()
    expect(screen.getByText('Sangria')).toBeInTheDocument()
  })

  it('signs money leaving the drawer apart from money coming in', () => {
    render(<CashMovements />)

    expect(screen.getByText(/^\+/)).toHaveTextContent('+R$ 60,00')
    expect(screen.getByText(/^−/)).toHaveTextContent('−R$ 30,00')
  })

  it('shows the reason someone gave for a withdrawal', () => {
    render(<CashMovements />)

    expect(screen.getByText(/Pagamento do gás/)).toBeInTheDocument()
  })

  it('says plainly when nothing moved yet', () => {
    facadeWith({ ...cashMovementsMock.session, movements: [] })

    render(<CashMovements />)

    expect(
      screen.getByText('Nada entrou nem saiu da gaveta desde a abertura.')
    ).toBeInTheDocument()
  })

  it('does not offer pages while everything fits on one', () => {
    render(<CashMovements />)

    expect(
      screen.queryByRole('button', { name: 'Próxima página' })
    ).not.toBeInTheDocument()
  })

  it('shows the first page and reaches the rest through the pagination', async () => {
    facadeWith(cashMovementsPagedMock.session)

    render(<CashMovements />)

    expect(screen.getAllByRole('row')).toHaveLength(9)

    await userEvent.click(
      screen.getByRole('button', { name: 'Próxima página' })
    )

    expect(screen.getAllByRole('row')).toHaveLength(3)
  })
})

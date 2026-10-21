import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCashFacade } from '../../facades/useCashFacade/useCashFacade'
import { CashSessionTabs } from './CashSessionTabs'
import { cashSessionTabsMock } from './CashSessionTabs.mock'

vi.mock('../../facades/useCashFacade/useCashFacade')

describe(CashSessionTabs.name, () => {
  beforeEach(() => {
    vi.mocked(useCashFacade).mockReturnValue({
      submitMovement: vi.fn(),
      submitClose: vi.fn(),
      isMoving: false,
      isClosing: false,
    } as unknown as ReturnType<typeof useCashFacade>)
  })

  it('opens on the summary with the drawer actions', () => {
    render(<CashSessionTabs {...cashSessionTabsMock} />)

    expect(screen.getByText('Caixa aberto')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sangria' })).toBeInTheDocument()
  })

  it('counts the movements on their tab', () => {
    render(<CashSessionTabs {...cashSessionTabsMock} />)

    expect(
      screen.getByRole('tab', { name: 'Movimentações · 2' })
    ).toBeInTheDocument()
  })

  it('moves to the movements without leaving the page', async () => {
    render(<CashSessionTabs {...cashSessionTabsMock} />)

    await userEvent.click(screen.getByRole('tab', { name: /Movimentações/ }))

    expect(await screen.findByText('Pagamento do gás')).toBeVisible()
  })

  it('keeps the actions out of a past day', () => {
    render(<CashSessionTabs {...cashSessionTabsMock} isToday={false} />)

    expect(
      screen.queryByRole('button', { name: 'Sangria' })
    ).not.toBeInTheDocument()
  })
})

import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCashFacade } from '../../facades/useCashFacade/useCashFacade'
import { CashSessionTabs } from './CashSessionTabs'
import { cashSessionTabsMock } from './CashSessionTabs.mock'

vi.mock('../../facades/useCashFacade/useCashFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useCashFacade).mockReturnValue({
    ...cashSessionTabsMock,
    submitMovement: vi.fn(),
    submitClose: vi.fn(),
    isMoving: false,
    isClosing: false,
    ...overrides,
  } as unknown as ReturnType<typeof useCashFacade>)

describe(CashSessionTabs.name, () => {
  beforeEach(() => facadeWith({}))

  it('renders nothing while there is no session', () => {
    facadeWith({ session: null })

    const { container } = render(<CashSessionTabs />)

    expect(container).toBeEmptyDOMElement()
  })

  it('opens on the summary with the drawer actions', () => {
    render(<CashSessionTabs />, { wrapper: MemoryRouter })

    expect(screen.getByText('Caixa aberto')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sangria' })).toBeInTheDocument()
  })

  it('counts the movements on their tab', () => {
    render(<CashSessionTabs />, { wrapper: MemoryRouter })

    expect(
      screen.getByRole('tab', { name: 'Movimentações · 2' })
    ).toBeInTheDocument()
  })

  it('moves to the movements without leaving the page', async () => {
    render(<CashSessionTabs />, { wrapper: MemoryRouter })

    await userEvent.click(screen.getByRole('tab', { name: /Movimentações/ }))

    expect(await screen.findByText('Pagamento do gás')).toBeVisible()
  })

  it('keeps the actions out of a past day', () => {
    facadeWith({ isToday: false })

    render(<CashSessionTabs />, { wrapper: MemoryRouter })

    expect(
      screen.queryByRole('button', { name: 'Sangria' })
    ).not.toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Cash } from './Cash'
import { cashPageSessionMock } from './Cash.mock'
import { useCashFacade } from './facades/useCashFacade/useCashFacade'

vi.mock('./facades/useCashFacade/useCashFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useCashFacade).mockReturnValue({
    session: null,
    isLoadingSession: false,
    isSessionError: false,
    submitOpen: vi.fn(),
    submitMovement: vi.fn(),
    submitClose: vi.fn(),
    isOpening: false,
    isMoving: false,
    isClosing: false,
    ...overrides,
  } as unknown as ReturnType<typeof useCashFacade>)

describe(Cash.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the skeleton while the drawer is unknown', () => {
    facadeWith({ isLoadingSession: true })

    render(<Cash />)

    expect(screen.getByLabelText('Carregando o caixa')).toBeInTheDocument()
  })

  it('says plainly when the drawer could not be read', () => {
    facadeWith({ isSessionError: true })

    render(<Cash />)

    expect(
      screen.getByText(/Não deu para carregar o caixa/)
    ).toBeInTheDocument()
  })

  it('offers to open the drawer when none is open', () => {
    facadeWith({})

    render(<Cash />)

    expect(
      screen.getByRole('button', { name: 'Abrir caixa' })
    ).toBeInTheDocument()
  })

  it('maps the open drawer into its three regions', () => {
    facadeWith({ session: cashPageSessionMock })

    render(<Cash />)

    expect(screen.getByText('Caixa aberto')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sangria' })).toBeInTheDocument()
    expect(screen.getByText('Movimentações')).toBeInTheDocument()
  })
})

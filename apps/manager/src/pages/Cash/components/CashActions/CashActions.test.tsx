import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCashFacade } from '../../facades/useCashFacade/useCashFacade'
import { CashActions } from './CashActions'
import { cashActionsMock } from './CashActions.mock'

vi.mock('../../facades/useCashFacade/useCashFacade')

describe(CashActions.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCashFacade).mockReturnValue({
      submitMovement: vi.fn(),
      submitClose: vi.fn(),
      isMoving: false,
      isClosing: false,
    } as unknown as ReturnType<typeof useCashFacade>)
  })

  it('offers the three things one does to an open drawer', () => {
    render(<CashActions {...cashActionsMock} />)

    expect(screen.getByRole('button', { name: 'Sangria' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Suprimento' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Fechar caixa' })
    ).toBeInTheDocument()
  })

  it('opens the withdrawal form', async () => {
    render(<CashActions {...cashActionsMock} />)

    await userEvent.click(screen.getByRole('button', { name: 'Sangria' }))

    expect(
      screen.getByRole('heading', { name: 'Registrar sangria' })
    ).toBeInTheDocument()
  })

  it('opens the deposit form', async () => {
    render(<CashActions {...cashActionsMock} />)

    await userEvent.click(screen.getByRole('button', { name: 'Suprimento' }))

    expect(
      screen.getByRole('heading', { name: 'Registrar suprimento' })
    ).toBeInTheDocument()
  })

  it('opens the closing form with the expected amount', async () => {
    render(<CashActions {...cashActionsMock} />)

    await userEvent.click(screen.getByRole('button', { name: 'Fechar caixa' }))

    expect(
      screen.getByRole('textbox', { name: 'Dinheiro contado' })
    ).toBeInTheDocument()
  })

  it('puts the withdrawal form away on cancel', async () => {
    // Arrange
    render(<CashActions {...cashActionsMock} />)
    await userEvent.click(screen.getByRole('button', { name: 'Sangria' }))

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    // Assert
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
  })

  it('puts the closing form away on cancel', async () => {
    // Arrange
    render(<CashActions {...cashActionsMock} />)
    await userEvent.click(screen.getByRole('button', { name: 'Fechar caixa' }))

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    // Assert
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
  })

  it('keeps every form shut until it is asked for', () => {
    render(<CashActions {...cashActionsMock} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

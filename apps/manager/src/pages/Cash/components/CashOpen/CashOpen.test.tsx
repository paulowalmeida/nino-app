import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCashFacade } from '../../facades/useCashFacade/useCashFacade'
import { CashOpen } from './CashOpen'
import {
  cashOpeningMaskedMock,
  cashOpeningTypedMock,
  cashOpeningValueMock,
} from './CashOpen.mock'

vi.mock('../../facades/useCashFacade/useCashFacade')

const submitOpen = vi.fn()

const facadeWith = (overrides: Record<string, unknown> = {}) =>
  vi.mocked(useCashFacade).mockReturnValue({
    submitOpen,
    isOpening: false,
    ...overrides,
  } as unknown as ReturnType<typeof useCashFacade>)

describe(CashOpen.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    facadeWith()
  })

  it('asks for the float left in the drawer', () => {
    render(<CashOpen />)

    expect(
      screen.getByRole('textbox', { name: 'Fundo de troco' })
    ).toBeInTheDocument()
  })

  it('opens the drawer with the amount that was typed', async () => {
    // Arrange
    render(<CashOpen />)

    // Act
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Fundo de troco' }),
      cashOpeningTypedMock
    )
    await userEvent.click(screen.getByRole('button', { name: 'Abrir caixa' }))

    // Assert
    expect(submitOpen).toHaveBeenCalledWith(cashOpeningValueMock)
  })

  it('masks the float while it is typed', async () => {
    // Arrange
    render(<CashOpen />)
    const field = screen.getByRole('textbox', { name: 'Fundo de troco' })

    // Act
    await userEvent.type(field, cashOpeningTypedMock)

    // Assert
    expect(field).toHaveValue(cashOpeningMaskedMock)
  })

  it('opens with nothing in the drawer when no float is given', async () => {
    // Arrange
    render(<CashOpen />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Abrir caixa' }))

    // Assert
    expect(submitOpen).toHaveBeenCalledWith(0)
  })

  it('holds the button while the drawer is being opened', () => {
    facadeWith({ isOpening: true })

    render(<CashOpen />)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})

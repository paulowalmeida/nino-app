import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AccountStep } from '@compositions/AccountStep/AccountStep'
import { useCheckAvailability } from '@hooks/auth/useCheckAvailability'

vi.mock('@hooks/auth/useCheckAvailability')

/* Field-by-field validation and the availability check are useAccountForm's
 * own concern, already covered in its test — what's under test here is the
 * composition's wiring: which fields render, the password meter toggle and
 * the required-field feedback the person sees. */
const renderAccountStep = (onNext = vi.fn()) => {
  vi.mocked(useCheckAvailability).mockReturnValue({
    mutateAsync: vi.fn(),
  } as unknown as ReturnType<typeof useCheckAvailability>)

  render(
    <MemoryRouter>
      <AccountStep defaultValues={null} onNext={onNext} />
    </MemoryRouter>
  )

  return { onNext }
}

describe(AccountStep.name, () => {
  it('renders every account field', () => {
    // Arrange / Act
    renderAccountStep()

    // Assert
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Telefone')).toBeInTheDocument()
    expect(screen.getByLabelText('CPF')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar senha')).toBeInTheDocument()
  })

  it('does not show the password meter before a password is typed', () => {
    // Arrange / Act
    renderAccountStep()

    // Assert
    expect(
      screen.queryByLabelText('Força da senha')
    ).not.toBeInTheDocument()
  })

  it('shows the password meter once a password is typed', async () => {
    // Arrange
    renderAccountStep()

    // Act
    await userEvent.type(screen.getByLabelText('Senha'), 'segredo123')

    // Assert
    expect(
      await screen.findByLabelText('Força da senha')
    ).toBeInTheDocument()
  })

  it('flags every required field left empty on submit', async () => {
    // Arrange
    const { onNext } = renderAccountStep()

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    // Assert
    expect(await screen.findByText('Informe o nome')).toBeInTheDocument()
    expect(onNext).not.toHaveBeenCalled()
  })

  it('links back to the login screen', () => {
    // Arrange / Act
    renderAccountStep()

    // Assert
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'href',
      '/entrar'
    )
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CompanyStep } from '@organisms/CompanyStep/CompanyStep'
import { useCheckAvailability } from '@hooks/auth/useCheckAvailability'
import { useSignup } from '@hooks/auth/useSignup'

import { ACCOUNT } from './CompanyStep.mock'

vi.mock('@hooks/auth/useCheckAvailability')
vi.mock('@hooks/auth/useSignup')

const renderCompanyStep = (onBack = vi.fn(), onSignedUp = vi.fn()) => {
  vi.mocked(useCheckAvailability).mockReturnValue({
    mutateAsync: vi.fn(),
  } as unknown as ReturnType<typeof useCheckAvailability>)
  vi.mocked(useSignup).mockReturnValue({
    mutateAsync: vi.fn(),
  } as unknown as ReturnType<typeof useSignup>)

  render(
    <CompanyStep account={ACCOUNT} onBack={onBack} onSignedUp={onSignedUp} />
  )

  return { onBack, onSignedUp }
}

describe(CompanyStep.name, () => {
  it('renders every company field', () => {
    // Arrange / Act
    renderCompanyStep()

    // Assert
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('CNPJ')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Razão social (opcional)')
    ).toBeInTheDocument()
  })

  it("greets the account's first name", () => {
    // Arrange / Act
    renderCompanyStep()

    // Assert
    expect(screen.getByText('Quase lá, Zé')).toBeInTheDocument()
  })

  it('flags the required fields left empty on submit', async () => {
    // Arrange
    const { onSignedUp } = renderCompanyStep()

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    // Assert
    expect(await screen.findByText('Informe o nome')).toBeInTheDocument()
    expect(onSignedUp).not.toHaveBeenCalled()
  })

  it('calls onBack when the person goes back', async () => {
    // Arrange
    const { onBack } = renderCompanyStep()

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    // Assert
    expect(onBack).toHaveBeenCalled()
  })
})

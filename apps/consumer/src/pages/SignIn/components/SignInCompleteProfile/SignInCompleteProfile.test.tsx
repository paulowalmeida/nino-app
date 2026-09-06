import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import { SignInCompleteProfile } from './SignInCompleteProfile'
import { signInCompleteProfileMock } from './SignInCompleteProfile.mock'

vi.mock('@pages/sign-in/facades/useSignInFacade/useSignInFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useSignInFacade).mockReturnValue({
    customer: signInCompleteProfileMock.fromPhone,
    name: '',
    setName: vi.fn(),
    phone: '',
    setPhone: vi.fn(),
    finishProfile: vi.fn(),
    isFinishingProfile: false,
    finishProfileFailed: false,
    ...overrides,
  } as unknown as ReturnType<typeof useSignInFacade>)

describe('SignInCompleteProfile', () => {
  it('asks who the person is when nothing came from a provider', () => {
    // Arrange
    facadeWith({})

    // Act
    render(<SignInCompleteProfile />)

    // Assert
    expect(screen.getByText('Como podemos te chamar?')).toBeInTheDocument()
    expect(screen.queryByText('ana@gmail.com')).not.toBeInTheDocument()
  })

  it('shows what google sent, to confirm instead of ask', () => {
    // Arrange
    facadeWith({
      customer: signInCompleteProfileMock.fromGoogle,
      name: 'Ana Souza',
    })

    // Act
    render(<SignInCompleteProfile />)

    // Assert
    expect(screen.getByText('Confirme seus dados')).toBeInTheDocument()
    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
    expect(screen.getByText('ana@gmail.com')).toBeInTheDocument()
  })

  it('keeps the name editable even when it came from google', () => {
    // Arrange
    facadeWith({
      customer: signInCompleteProfileMock.fromGoogle,
      name: 'Ana Souza',
    })

    // Act
    render(<SignInCompleteProfile />)

    // Assert
    expect(screen.getByLabelText(/Nome/)).toHaveValue('Ana Souza')
  })

  it('asks for the phone only when the account has none', () => {
    // Arrange
    facadeWith({ customer: signInCompleteProfileMock.withPhone })

    // Act
    render(<SignInCompleteProfile />)

    // Assert
    expect(screen.queryByLabelText(/Telefone/)).not.toBeInTheDocument()
  })
})

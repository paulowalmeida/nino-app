import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  useSignInFacade,
} from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import { SignInCodeForm } from './SignInCodeForm'
import { signInCodeFormMock } from './SignInCodeForm.mock'

vi.mock('@pages/sign-in/facades/useSignInFacade/useSignInFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useSignInFacade).mockReturnValue({
    channel: 'phone',
    phone: signInCodeFormMock.phone,
    email: '',
    code: '',
    setCode: vi.fn(),
    verifyCode: vi.fn(),
    isVerifying: false,
    verifyFailed: false,
    goToIdentify: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useSignInFacade>)

describe('SignInCodeForm', () => {
  it('keeps entering disabled until the code has six digits', () => {
    facadeWith({ code: signInCodeFormMock.incompleteCode })

    render(<SignInCodeForm />)

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeDisabled()
  })

  it('enables entering once the code is complete', () => {
    facadeWith({ code: signInCodeFormMock.completeCode })

    render(<SignInCodeForm />)

    expect(screen.getByRole('button', { name: 'Entrar' })).not.toBeDisabled()
  })

  it('shows the invalid-code error above the actions', () => {
    facadeWith({ verifyFailed: true })

    render(<SignInCodeForm />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('returns to the identify step when asking for another phone', async () => {
    // Arrange
    const goToIdentify = vi.fn()
    facadeWith({ goToIdentify })
    render(<SignInCodeForm />)

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Usar outro telefone' })
    )

    // Assert
    expect(goToIdentify).toHaveBeenCalled()
  })
})

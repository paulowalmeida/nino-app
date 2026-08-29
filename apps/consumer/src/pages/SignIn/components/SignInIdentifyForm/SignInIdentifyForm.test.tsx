import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import { SignInIdentifyForm } from './SignInIdentifyForm'
import { signInIdentifyFormMock } from './SignInIdentifyForm.mock'

vi.mock('@pages/sign-in/facades/useSignInFacade/useSignInFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useSignInFacade).mockReturnValue({
    channel: 'phone',
    setChannel: vi.fn(),
    phone: '',
    setPhone: vi.fn(),
    email: '',
    setEmail: vi.fn(),
    requestCode: vi.fn(),
    isRequesting: false,
    requestFailed: false,
    ...overrides,
  } as unknown as ReturnType<typeof useSignInFacade>)

describe('SignInIdentifyForm', () => {
  it('keeps the submit action disabled until the phone is complete', () => {
    facadeWith({ phone: signInIdentifyFormMock.incompletePhone })

    render(<SignInIdentifyForm />)

    expect(screen.getByRole('button', { name: 'Enviar código' })).toBeDisabled()
  })

  it('requests the code once the phone is complete', async () => {
    // Arrange
    const requestCode = vi.fn()
    facadeWith({
      phone: signInIdentifyFormMock.completePhone,
      requestCode,
    })
    render(<SignInIdentifyForm />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Enviar código' }))

    // Assert
    expect(requestCode).toHaveBeenCalledWith({ phone: '+5511987654321' })
  })

  it('switches to the e-mail field and validates it instead', async () => {
    // Arrange
    facadeWith({ channel: 'email', email: signInIdentifyFormMock.validEmail })
    render(<SignInIdentifyForm />)

    // Assert
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Enviar código' })
    ).not.toBeDisabled()
  })

  it('shows the send error above the action', () => {
    facadeWith({ requestFailed: true })

    render(<SignInIdentifyForm />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

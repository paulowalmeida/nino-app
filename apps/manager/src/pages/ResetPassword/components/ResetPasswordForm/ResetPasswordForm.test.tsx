import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useResetPasswordFacade } from '@pages/ResetPassword/facades/useResetPasswordFacade/useResetPasswordFacade'

import { ResetPasswordForm } from './ResetPasswordForm'
import { resetPasswordFormMock } from './ResetPasswordForm.mock'

vi.mock(
  '@pages/ResetPassword/facades/useResetPasswordFacade/useResetPasswordFacade'
)

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useResetPasswordFacade).mockReturnValue({
    register: vi.fn(() => ({})),
    submit: vi.fn(),
    getValues: vi.fn(),
    fieldErrors: {},
    isSending: false,
    hasToken: true,
    ...overrides,
  } as unknown as ReturnType<typeof useResetPasswordFacade>)

describe('ResetPasswordForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('asks for the new password twice and offers to submit', () => {
    facadeWith({})

    render(<ResetPasswordForm />)

    expect(
      screen.getByLabelText(resetPasswordFormMock.passwordLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(resetPasswordFormMock.confirmPasswordLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: resetPasswordFormMock.submitLabel })
    ).toBeInTheDocument()
  })

  it('submits the form to redefine the password', () => {
    const submit = vi.fn((event: { preventDefault: () => void }) =>
      event.preventDefault()
    )
    facadeWith({ submit })

    render(<ResetPasswordForm />)
    fireEvent.submit(
      screen
        .getByRole('button', { name: resetPasswordFormMock.submitLabel })
        .closest('form') as HTMLFormElement
    )

    expect(submit).toHaveBeenCalled()
  })

  it('shows a rejected reset above the button', () => {
    facadeWith({
      fieldErrors: {
        root: { message: resetPasswordFormMock.rootErrorMessage },
      },
    })

    render(<ResetPasswordForm />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      resetPasswordFormMock.rootErrorMessage
    )
  })

  it('replaces the form with an error when the link carries no token', () => {
    facadeWith({ hasToken: false })

    render(<ResetPasswordForm />)

    expect(
      screen.queryByLabelText(resetPasswordFormMock.passwordLabel)
    ).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(
      resetPasswordFormMock.rootErrorMessage
    )
  })

  it('holds the button busy while the reset is on its way', () => {
    facadeWith({ isSending: true })

    render(<ResetPasswordForm />)

    const action = screen.getByRole('button', { name: 'Carregando' })
    expect(action).toBeDisabled()
  })
})

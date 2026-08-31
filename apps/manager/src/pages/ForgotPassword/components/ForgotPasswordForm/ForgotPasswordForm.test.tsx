import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useForgotPasswordFacade } from '@pages/ForgotPassword/facades/useForgotPasswordFacade/useForgotPasswordFacade'

import { ForgotPasswordForm } from './ForgotPasswordForm'
import { forgotPasswordFormMock } from './ForgotPasswordForm.mock'

vi.mock(
  '@pages/ForgotPassword/facades/useForgotPasswordFacade/useForgotPasswordFacade'
)

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useForgotPasswordFacade).mockReturnValue({
    register: vi.fn(() => ({})),
    submit: vi.fn(),
    fieldErrors: {},
    isSending: false,
    sentTo: null,
    useAnotherEmail: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useForgotPasswordFacade>)

describe('ForgotPasswordForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('asks for the e-mail and offers to send the link', () => {
    facadeWith({})

    render(<ForgotPasswordForm />)

    expect(
      screen.getByLabelText(forgotPasswordFormMock.emailLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: forgotPasswordFormMock.submitLabel })
    ).toBeInTheDocument()
  })

  it('submits the form to request the recovery link', () => {
    const submit = vi.fn((event: { preventDefault: () => void }) =>
      event.preventDefault()
    )
    facadeWith({ submit })

    render(<ForgotPasswordForm />)
    fireEvent.submit(
      screen
        .getByRole('button', { name: forgotPasswordFormMock.submitLabel })
        .closest('form') as HTMLFormElement
    )

    expect(submit).toHaveBeenCalled()
  })

  it('shows a failed request above the button', () => {
    facadeWith({
      fieldErrors: { root: { message: forgotPasswordFormMock.rootErrorMessage } },
    })

    render(<ForgotPasswordForm />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      forgotPasswordFormMock.rootErrorMessage
    )
  })

  it('replaces the form with a confirmation once the request is sent', () => {
    facadeWith({ sentTo: forgotPasswordFormMock.sentEmail })

    render(<ForgotPasswordForm />)

    expect(
      screen.queryByLabelText(forgotPasswordFormMock.emailLabel)
    ).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      forgotPasswordFormMock.sentEmail
    )
  })

  it('holds the button busy while the request is on its way', () => {
    facadeWith({ isSending: true })

    render(<ForgotPasswordForm />)

    const action = screen.getByRole('button', { name: 'Carregando' })
    expect(action).toBeDisabled()
  })
})

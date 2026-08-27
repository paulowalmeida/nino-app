import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLoginFacade } from '@pages/Login/facades/useLoginFacade/useLoginFacade'

import { LoginForm } from './LoginForm'
import { loginFormMock } from './LoginForm.mock'

vi.mock('@pages/Login/facades/useLoginFacade/useLoginFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useLoginFacade).mockReturnValue({
    register: vi.fn(() => ({})),
    submit: vi.fn(),
    fieldErrors: {},
    isSending: false,
    ...overrides,
  } as unknown as ReturnType<typeof useLoginFacade>)

describe('LoginForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('asks for e-mail, password, and the way in', () => {
    facadeWith({})

    render(<LoginForm />)

    expect(screen.getByLabelText(loginFormMock.emailLabel)).toBeInTheDocument()
    expect(
      screen.getByLabelText(loginFormMock.passwordLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: loginFormMock.submitLabel })
    ).toBeInTheDocument()
  })

  it('shows a rejected login above the button, not on a field', () => {
    facadeWith({
      fieldErrors: { root: { message: loginFormMock.rootErrorMessage } },
    })

    render(<LoginForm />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      loginFormMock.rootErrorMessage
    )
  })

  it('holds the button busy while the login is on its way', () => {
    facadeWith({ isSending: true })

    render(<LoginForm />)

    const action = screen.getByRole('button', { name: 'Carregando' })
    expect(action).toBeDisabled()
    expect(
      screen.queryByRole('button', { name: loginFormMock.submitLabel })
    ).not.toBeInTheDocument()
  })
})

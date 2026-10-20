import { MemoryRouter } from 'react-router'

import { fireEvent, render, screen } from '@testing-library/react'
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

const renderForm = () =>
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  )

describe('LoginForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('asks for e-mail, password, and the way in', () => {
    facadeWith({})

    renderForm()

    expect(screen.getByLabelText(loginFormMock.emailLabel)).toBeInTheDocument()
    expect(
      screen.getByLabelText(loginFormMock.passwordLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: loginFormMock.submitLabel })
    ).toBeInTheDocument()
  })

  it('offers a way to recover a forgotten password', () => {
    facadeWith({})

    renderForm()

    expect(
      screen.getByRole('link', { name: 'Esqueceu a senha?' })
    ).toHaveAttribute('href', '/esqueci-senha')
  })

  it('shows a rejected login above the button, not on a field', () => {
    facadeWith({
      fieldErrors: { root: { message: loginFormMock.rootErrorMessage } },
    })

    renderForm()

    expect(screen.getByRole('alert')).toHaveTextContent(
      loginFormMock.rootErrorMessage
    )
  })

  it('submits the form to attempt login', () => {
    const submit = vi.fn((event: { preventDefault: () => void }) =>
      event.preventDefault()
    )
    facadeWith({ submit })

    renderForm()
    fireEvent.submit(
      screen
        .getByRole('button', { name: loginFormMock.submitLabel })
        .closest('form') as HTMLFormElement
    )

    expect(submit).toHaveBeenCalled()
  })

  it('holds the button busy while the login is on its way', () => {
    facadeWith({ isSending: true })

    renderForm()

    const action = screen.getByRole('button', { name: 'Carregando' })
    expect(action).toBeDisabled()
    expect(
      screen.queryByRole('button', { name: loginFormMock.submitLabel })
    ).not.toBeInTheDocument()
  })
})

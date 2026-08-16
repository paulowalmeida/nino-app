import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useLogin } from '@hooks/auth/useLogin'
import { ApiError } from '@nino/lib/utils/api-error'

import { LoginForm } from '@organisms/LoginForm/LoginForm'

vi.mock('@hooks/auth/useLogin')

const mockLogin = (mutateAsync = vi.fn()) =>
  vi.mocked(useLogin).mockReturnValue({
    mutateAsync,
  } as unknown as ReturnType<typeof useLogin>)

describe(LoginForm.name, () => {
  it('requires email and password before submitting', async () => {
    // Arrange
    const mutateAsync = vi.fn()
    mockLogin(mutateAsync)
    render(<LoginForm />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    // Assert
    expect(screen.getByText('Informe o email')).toBeInTheDocument()
    expect(screen.getByText('Informe a senha')).toBeInTheDocument()
    expect(mutateAsync).not.toHaveBeenCalled()
  })

  it('submits the typed credentials', async () => {
    // Arrange
    const mutateAsync = vi.fn().mockResolvedValue(undefined)
    mockLogin(mutateAsync)
    render(<LoginForm />)

    // Act
    await userEvent.type(screen.getByLabelText('Email'), 'ana@nino.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'segredo123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    // Assert
    expect(mutateAsync).toHaveBeenCalledWith({
      email: 'ana@nino.com',
      password: 'segredo123',
    })
  })

  it('shows the translated message when credentials are rejected', async () => {
    // Arrange
    const mutateAsync = vi.fn().mockRejectedValue(new ApiError(401, 'nope'))
    mockLogin(mutateAsync)
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText('Email'), 'ana@nino.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'errada123')

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    // Assert
    expect(
      await screen.findByText('E-mail ou senha incorretos.')
    ).toBeInTheDocument()
  })
})

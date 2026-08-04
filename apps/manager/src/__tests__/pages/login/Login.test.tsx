import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useLogin } from '@hooks/auth/useLogin'

import { Login } from '@pages/login/Login'

vi.mock('@hooks/auth/useLogin')

describe(Login.name, () => {
  it('renders the login form', () => {
    // Arrange
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof useLogin>)

    // Act
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.getByRole('button', { name: 'Entrar' })
    ).toBeInTheDocument()
  })
})
